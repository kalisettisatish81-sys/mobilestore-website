'use server';

import { revalidatePath } from 'next/cache';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { verifyAdminStatus } from '@/lib/auth-server';
import type { Mobile, MobileInput, Database } from '@/types';

type ActionResult<T> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };

/**
 * Validates admin authentication and authorization.
 */
async function checkAdminAuth(): Promise<{
  authorized: boolean;
  userId?: string;
  error?: string;
}> {
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { authorized: false, error: 'Unauthorized: Please log in as an administrator.' };
  }

  const isAdmin = await verifyAdminStatus(user.id);
  if (!isAdmin) {
    return {
      authorized: false,
      error: 'Forbidden: You do not have permission to manage mobile products.',
    };
  }

  return { authorized: true, userId: user.id };
}

/**
 * Validates mobile input fields according to schema constraints.
 */
function validateMobileInput(input: Partial<MobileInput>, isPartial = false): string | null {
  // Mobile Name
  if (!isPartial || input.name !== undefined) {
    const name = input.name?.trim();
    if (!name) return 'Mobile Name is required.';
    if (name.length > 100) return 'Mobile Name cannot exceed 100 characters.';
  }

  // Brand
  if (!isPartial || input.brand !== undefined) {
    const brand = input.brand?.trim();
    if (!brand) return 'Brand is required.';
    if (brand.length > 50) return 'Brand cannot exceed 50 characters.';
  }

  // Description (Optional)
  if (input.description !== undefined && input.description !== null) {
    const desc = input.description.trim();
    if (desc.length > 2000) return 'Description cannot exceed 2000 characters.';
  }

  // Price
  if (!isPartial || input.price !== undefined) {
    if (input.price === undefined || input.price === null) {
      return 'Price is required.';
    }
    const price = Number(input.price);
    if (isNaN(price) || price < 0) {
      return 'Price must be a valid number greater than or equal to 0.';
    }
  }

  // RAM
  if (!isPartial || input.ram !== undefined) {
    const ram = input.ram?.trim();
    if (!ram) return 'RAM specification is required.';
  }

  // Storage
  if (!isPartial || input.storage !== undefined) {
    const storage = input.storage?.trim();
    if (!storage) return 'Storage specification is required.';
  }

  // Stock Status
  if (!isPartial || input.stock_status !== undefined) {
    const validStockStatuses = ['In Stock', 'Limited Stock', 'Out of Stock'];
    if (!input.stock_status || !validStockStatuses.includes(input.stock_status)) {
      return 'Invalid Stock Status. Allowed values: In Stock, Limited Stock, Out of Stock.';
    }
  }

  // Images
  if (!isPartial || input.images !== undefined) {
    if (!Array.isArray(input.images) || input.images.length < 1) {
      return 'Product must have at least 1 image.';
    }
    if (input.images.length > 5) {
      return 'Product cannot exceed 5 images.';
    }
  }

  return null;
}

/**
 * Revalidates all relevant administrative and customer routes.
 */
function revalidateMobileRoutes() {
  revalidatePath('/admin/mobiles');
  revalidatePath('/mobiles');
  revalidatePath('/');
}

/**
 * Fetches all mobiles for the admin list (both visible and hidden), ordered newest first.
 */
export async function getMobilesAction(): Promise<ActionResult<Mobile[]>> {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('mobiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: 'Unable to fetch mobile inventory right now.' };
    }

    return { success: true, data: (data as Mobile[]) || [] };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to fetch mobile products.';
    return { success: false, error: message };
  }
}

/**
 * Creates a new mobile product in Supabase.
 */
export async function createMobileAction(input: MobileInput): Promise<ActionResult<Mobile>> {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  const validationError = validateMobileInput(input, false);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('mobiles')
      .insert({
        name: input.name.trim(),
        brand: input.brand.trim(),
        description: input.description ? input.description.trim() : null,
        price: Number(input.price),
        ram: input.ram.trim(),
        storage: input.storage.trim(),
        stock_status: input.stock_status,
        images: input.images,
        is_hidden: input.is_hidden ?? false,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: 'Unable to save mobile right now. Please try again.' };
    }

    revalidateMobileRoutes();
    return { success: true, data: data as Mobile };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to save mobile right now. Please try again.';
    return { success: false, error: message };
  }
}

/**
 * Updates an existing mobile product.
 */
export async function updateMobileAction(
  id: string,
  input: Partial<MobileInput>
): Promise<ActionResult<Mobile>> {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  if (!id) {
    return { success: false, error: 'Mobile ID is required.' };
  }

  const validationError = validateMobileInput(input, true);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const supabase = await createServerClient();

    const updatePayload: Database['public']['Tables']['mobiles']['Update'] = {};
    if (input.name !== undefined) updatePayload.name = input.name.trim();
    if (input.brand !== undefined) updatePayload.brand = input.brand.trim();
    if (input.description !== undefined) {
      updatePayload.description = input.description ? input.description.trim() : null;
    }
    if (input.price !== undefined) updatePayload.price = Number(input.price);
    if (input.ram !== undefined) updatePayload.ram = input.ram.trim();
    if (input.storage !== undefined) updatePayload.storage = input.storage.trim();
    if (input.stock_status !== undefined) updatePayload.stock_status = input.stock_status;
    if (input.images !== undefined) updatePayload.images = input.images;
    if (input.is_hidden !== undefined) updatePayload.is_hidden = input.is_hidden;

    const { data, error } = await supabase
      .from('mobiles')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, error: 'Unable to update mobile right now. Please try again.' };
    }

    revalidateMobileRoutes();
    return { success: true, data: data as Mobile };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to update mobile right now. Please try again.';
    return { success: false, error: message };
  }
}

/**
 * Toggles product visibility (Hide / Show).
 */
export async function toggleMobileVisibilityAction(
  id: string,
  isHidden: boolean
): Promise<ActionResult<{ is_hidden: boolean }>> {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  try {
    const supabase = await createServerClient();
    const { error } = await supabase
      .from('mobiles')
      .update({ is_hidden: isHidden })
      .eq('id', id);

    if (error) {
      return { success: false, error: 'Unable to update mobile visibility. Please try again.' };
    }

    revalidateMobileRoutes();
    return { success: true, data: { is_hidden: isHidden } };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to update visibility.';
    return { success: false, error: message };
  }
}

/**
 * Deletes a mobile product from Supabase.
 */
export async function deleteMobileAction(id: string): Promise<ActionResult<{ id: string }>> {
  const auth = await checkAdminAuth();
  if (!auth.authorized) {
    return { success: false, error: auth.error || 'Unauthorized' };
  }

  if (!id) {
    return { success: false, error: 'Mobile ID is required.' };
  }

  try {
    const supabase = await createServerClient();
    const { error } = await supabase
      .from('mobiles')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: 'Unable to delete mobile right now. Please try again.' };
    }

    revalidateMobileRoutes();
    return { success: true, data: { id } };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to delete mobile right now. Please try again.';
    return { success: false, error: message };
  }
}
