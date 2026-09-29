'use server';

import { revalidatePath } from 'next/cache';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { verifyAdminStatus } from '@/lib/auth-server';
import type { ContactMessage } from '@/types';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Server action to fetch all contact messages ordered chronologically.
 * Admin authorization is strictly enforced before database retrieval.
 */
export async function getContactMessagesAction(): Promise<{
  success: boolean;
  data?: ContactMessage[];
  error?: string;
}> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }

    const isAdmin = await verifyAdminStatus(user.id);
    if (!isAdmin) {
      return { success: false, error: 'Forbidden: Administrator privileges required.' };
    }

    const { data: messages, error: dbError } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbError) {
      console.error('getContactMessagesAction database error:', dbError.message);
      return { success: false, error: 'Unable to load contact messages right now.' };
    }

    return {
      success: true,
      data: (messages as ContactMessage[]) || [],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Unexpected error in getContactMessagesAction:', message);
    return { success: false, error: 'Unable to load contact messages right now.' };
  }
}

/**
 * Server action to fetch a single contact message by its UUID.
 */
export async function getContactMessageAction(id: string): Promise<{
  success: boolean;
  data?: ContactMessage;
  error?: string;
}> {
  try {
    if (!id || !UUID_REGEX.test(id)) {
      return { success: false, error: 'Invalid message identifier provided.' };
    }

    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }

    const isAdmin = await verifyAdminStatus(user.id);
    if (!isAdmin) {
      return { success: false, error: 'Forbidden: Administrator privileges required.' };
    }

    const { data: message, error: dbError } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single();

    if (dbError || !message) {
      return { success: false, error: 'Message not found.' };
    }

    return {
      success: true,
      data: message as ContactMessage,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Unexpected error in getContactMessageAction:', message);
    return { success: false, error: 'Unable to retrieve message details.' };
  }
}

/**
 * Server action to permanently delete a customer contact message.
 * Enforces admin authorization, validates ID, and invalidates message cache.
 */
export async function deleteContactMessageAction(id: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    if (!id || !UUID_REGEX.test(id)) {
      return { success: false, error: 'Invalid message identifier provided.' };
    }

    const supabase = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized: Admin authentication required.' };
    }

    const isAdmin = await verifyAdminStatus(user.id);
    if (!isAdmin) {
      return { success: false, error: 'Forbidden: Administrator privileges required.' };
    }

    const { error: dbError } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (dbError) {
      console.error('deleteContactMessageAction database error:', dbError.message);
      return {
        success: false,
        error: 'Unable to delete message right now. Please try again.',
      };
    }

    // Revalidate admin views
    revalidatePath('/admin/messages');
    revalidatePath('/admin');

    console.log(`Contact message ${id} deleted by admin ${user.email}`);

    return {
      success: true,
      message: 'Message deleted successfully.',
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Unexpected error in deleteContactMessageAction:', message);
    return {
      success: false,
      error: 'Unable to delete message right now. Please try again.',
    };
  }
}
