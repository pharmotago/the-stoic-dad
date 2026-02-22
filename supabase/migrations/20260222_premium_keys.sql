CREATE TABLE public.premium_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key_code TEXT UNIQUE NOT NULL,
    customer_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unused' CHECK (status IN ('unused', 'used')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE
);

-- RLS Policies
ALTER TABLE public.premium_keys ENABLE ROW LEVEL SECURITY;

-- Only service role can insert/update (backend operations)
CREATE POLICY "Service role can manage premium keys" 
ON public.premium_keys 
USING (true) 
WITH CHECK (true);
