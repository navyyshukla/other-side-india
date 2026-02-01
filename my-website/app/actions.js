// @ts-nocheck
'use server'

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export async function submitVote(voteType) {
  try {
    const { error } = await supabase.rpc('cast_vote', { vote_type: voteType });
    
    if (error) {
      console.error('Error voting:', error);
      return { success: false };
    }
    
    revalidatePath('/');
    return { success: true };

  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false };
  }
}