-- ============================================================
-- VISAVA SHWAN ASHRAM - Supabase Schema & Policies
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Create the donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_screenshot_url TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- 3. Allow public INSERT
CREATE POLICY "Allow public insert" ON donations
  FOR INSERT TO anon WITH CHECK (true);

-- 4. Allow public READ
CREATE POLICY "Allow public read" ON donations
  FOR SELECT TO anon USING (true);

-- 5. Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE donations;

-- ============================================================
-- STORAGE SETUP (run after creating the bucket in dashboard)
-- Go to: Storage > New Bucket > Name: "payment-screenshots" > Public ON
-- Then run these policies:
-- ============================================================

CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'payment-screenshots');

CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'payment-screenshots');
