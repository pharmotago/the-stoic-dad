import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { key } = await req.json();

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        // Check if key exists and is unused
        const { data, error } = await supabase
            .from('premium_keys')
            .select('*')
            .eq('key_code', key)
            .eq('status', 'unused')
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Invalid or already used access key.' }, { status: 400 });
        }

        // Mark as used
        const { error: updateError } = await supabase
            .from('premium_keys')
            .update({ status: 'used', used_at: new Date().toISOString() })
            .eq('id', data.id);

        if (updateError) {
            return NextResponse.json({ error: 'Failed to redeem key.' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Verify Key Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
