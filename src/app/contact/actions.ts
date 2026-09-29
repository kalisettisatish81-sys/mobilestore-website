'use server';

import { createClient as createServerClient } from '@/lib/supabase/server';
import type { ContactMessageInput } from '@/types';

export interface ContactActionResult {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Partial<Record<keyof ContactMessageInput, string>>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^[+]?[\d\s\-().]{7,25}$/;

/**
 * Server action to validate and persist customer contact inquiries.
 * Enforces strict input validation and safe error masking.
 */
export async function submitContactMessageAction(
  rawInput: ContactMessageInput
): Promise<ContactActionResult> {
  try {
    // 1. Sanitize and trim all inputs
    const name = rawInput.name?.trim() || '';
    const email = rawInput.email?.trim().toLowerCase() || '';
    const phone = rawInput.phone?.trim() || '';
    const subject = rawInput.subject?.trim() || '';
    const message = rawInput.message?.trim() || '';

    const fieldErrors: Partial<Record<keyof ContactMessageInput, string>> = {};

    // 2. Validate Full Name
    if (!name) {
      fieldErrors.name = 'Please provide your full name.';
    } else if (name.length < 2) {
      fieldErrors.name = 'Name must be at least 2 characters.';
    } else if (name.length > 100) {
      fieldErrors.name = 'Name cannot exceed 100 characters.';
    }

    // 3. Validate Email
    if (!email) {
      fieldErrors.email = 'Please provide an email address.';
    } else if (email.length > 254 || !EMAIL_REGEX.test(email)) {
      fieldErrors.email = 'Please provide a valid email address.';
    }

    // 4. Validate Phone (Optional)
    if (phone && !PHONE_REGEX.test(phone)) {
      fieldErrors.phone = 'Please provide a valid phone number (e.g. +91 98765 43210).';
    }

    // 5. Validate Subject
    if (!subject) {
      fieldErrors.subject = 'Please enter a subject.';
    } else if (subject.length < 3) {
      fieldErrors.subject = 'Subject must be at least 3 characters.';
    } else if (subject.length > 150) {
      fieldErrors.subject = 'Subject cannot exceed 150 characters.';
    }

    // 6. Validate Message
    if (!message) {
      fieldErrors.message = 'Please enter your message.';
    } else if (message.length < 10) {
      fieldErrors.message = 'Message must be at least 10 characters.';
    } else if (message.length > 2000) {
      fieldErrors.message = 'Message cannot exceed 2000 characters.';
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: 'Please correct the highlighted errors before submitting.',
        fieldErrors,
      };
    }

    // 7. Persist to database via Supabase
    const supabase = await createServerClient();
    const { error: dbError } = await supabase.from('contact_messages').insert({
      name,
      email,
      phone: phone || null,
      subject,
      message,
    });

    if (dbError) {
      // Safe server logging - never expose raw database errors or stack traces to client
      console.error('Contact message database error:', dbError.message);
      return {
        success: false,
        error: 'Unable to send your message right now. Please try again.',
      };
    }

    console.log(`Contact message successfully submitted by: ${name} (${email})`);

    return {
      success: true,
      message: 'Your message has been sent successfully.',
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Unexpected error in submitContactMessageAction:', errorMsg);
    return {
      success: false,
      error: 'Unable to send your message right now. Please try again.',
    };
  }
}
