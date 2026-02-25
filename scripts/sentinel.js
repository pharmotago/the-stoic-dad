
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env
const envPath = join(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('--- NEURAL SENTINEL INITIALIZED ---');
console.log('Listening for pulses in nabi_directives...');

async function checkDirectives() {
    try {
        const { data, error } = await supabase
            .from('nabi_directives')
            .select('*')
            .eq('status', 'PENDING')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
            console.log(`\n[PULSE DETECTED] ${new Date().toISOString()}`);
            data.forEach(d => {
                console.log(`ID: ${d.id} | CONTENT: ${d.content}`);
            });
        }
    } catch (err) {
        console.error('[SENTINEL ERROR]', err.message);
    }
}

// Poll every 10 seconds
setInterval(checkDirectives, 10000);
checkDirectives();
