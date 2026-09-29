import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Mobile } from '@/types';
import { DEFAULT_MOBILES } from '@/data/defaultMobiles';

/**
 * Merges Supabase mobile products with default curated mobiles.
 * Products saved in the database take precedence over default items with matching IDs or names.
 */
function mergeMobiles(dbMobiles: Mobile[]): Mobile[] {
  const map = new Map<string, Mobile>();

  // 1. Add default 20 mobiles
  for (const m of DEFAULT_MOBILES) {
    map.set(m.id, m);
  }

  // 2. Overlay database mobiles (overriding defaults if matching ID or name)
  for (const dbMobile of dbMobiles) {
    // If a default product has the exact same name, replace it with the DB version
    const existingKey = Array.from(map.entries()).find(
      ([, item]) => item.name.toLowerCase() === dbMobile.name.toLowerCase()
    )?.[0];

    if (existingKey) {
      map.delete(existingKey);
    }
    map.set(dbMobile.id, dbMobile);
  }

  // Return list sorted newest first
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Retrieves all visible mobile products.
 */
export async function getVisibleMobiles(): Promise<Mobile[]> {
  try {
    if (!isSupabaseConfigured()) {
      return DEFAULT_MOBILES.filter((m) => !m.is_hidden);
    }

    const { data, error } = await supabase
      .from('mobiles')
      .select('*')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase fetch failed or empty; using default mobiles:', error?.message);
      return DEFAULT_MOBILES.filter((m) => !m.is_hidden);
    }

    return mergeMobiles(data as Mobile[]).filter((m) => !m.is_hidden);
  } catch (err) {
    console.error('Error fetching visible mobiles:', err);
    return DEFAULT_MOBILES.filter((m) => !m.is_hidden);
  }
}

/**
 * Retrieves a single visible mobile by ID.
 */
export async function getMobileById(id: string): Promise<Mobile | null> {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('mobiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        if (data.is_hidden) return null;
        return data as Mobile;
      }
    }

    // Fallback to default mobiles
    const found = DEFAULT_MOBILES.find((m) => m.id === id);
    if (found && !found.is_hidden) {
      return found;
    }

    return null;
  } catch (err) {
    console.error('Error fetching mobile by ID:', err);
    const found = DEFAULT_MOBILES.find((m) => m.id === id);
    return found && !found.is_hidden ? found : null;
  }
}

/**
 * Retrieves unique brands from all visible mobiles.
 */
export async function getUniqueBrands(): Promise<string[]> {
  const mobiles = await getVisibleMobiles();
  const brandsSet = new Set(
    mobiles
      .map((m) => m.brand?.trim())
      .filter((b): b is string => Boolean(b && b.length > 0))
  );

  return Array.from(brandsSet).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );
}

/**
 * Retrieves the featured mobiles for the homepage (limit 8, newest first).
 */
export async function getFeaturedMobiles(): Promise<Mobile[]> {
  const mobiles = await getVisibleMobiles();
  return mobiles.slice(0, 8);
}
