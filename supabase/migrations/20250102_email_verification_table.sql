-- Email verification table for secure email verification flow
CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(token);
CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);
CREATE INDEX IF NOT EXISTS idx_email_verifications_expires_at ON email_verifications(expires_at);

-- RLS policies
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own verification records
CREATE POLICY "Users can view own email verifications" ON email_verifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own verification records
CREATE POLICY "Users can create own email verifications" ON email_verifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own verification records
CREATE POLICY "Users can update own email verifications" ON email_verifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all verification records
CREATE POLICY "Admins can view all email verifications" ON email_verifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_email_verifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_verifications_updated_at
  BEFORE UPDATE ON email_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_email_verifications_updated_at();

-- Cleanup function for expired tokens (run as scheduled job)
CREATE OR REPLACE FUNCTION cleanup_expired_email_verifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM email_verifications 
  WHERE expires_at < NOW() AND verified = FALSE;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
