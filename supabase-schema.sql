-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')) NOT NULL,
  state TEXT CHECK (state IN ('open', 'resolved')) DEFAULT 'open' NOT NULL
);

-- Create settings table (single row)
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  require_dual_approval BOOLEAN DEFAULT true NOT NULL,
  enable_high_risk_block BOOLEAN DEFAULT true NOT NULL,
  send_fraud_alerts BOOLEAN DEFAULT true NOT NULL,
  daily_transfer_limit TEXT DEFAULT '500000' NOT NULL,
  auto_freeze_threshold TEXT DEFAULT '90' NOT NULL,
  default_settlement_rail TEXT CHECK (default_settlement_rail IN ('ACH', 'SWIFT', 'Wire')) DEFAULT 'ACH' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transfers table
CREATE TABLE IF NOT EXISTS transfers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender TEXT NOT NULL,
  sender_account TEXT NOT NULL,
  receiver TEXT NOT NULL,
  receiver_account TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  fee DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  method TEXT NOT NULL,
  status TEXT CHECK (status IN ('completed', 'pending', 'pending_review', 'processing', 'failed', 'reversed')) DEFAULT 'pending' NOT NULL,
  risk DECIMAL(5,2) NOT NULL,
  initiated_by TEXT NOT NULL,
  initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settled_at TIMESTAMP WITH TIME ZONE
);

-- Insert default settings row
INSERT INTO settings (require_dual_approval, enable_high_risk_block, send_fraud_alerts, daily_transfer_limit, auto_freeze_threshold, default_settlement_rail)
VALUES (true, true, true, '500000', '90', 'ACH')
ON CONFLICT DO NOTHING;

-- Insert sample alerts data
INSERT INTO alerts (title, description, source, severity, state) VALUES
('Spike in high-risk transfer attempts', 'Risk engine flagged 13 transfers above 85 risk score in the last 10 minutes.', 'Fraud Monitor', 'critical', 'open'),
('ACH settlement latency increased', 'Average processing latency exceeded 2.5x baseline for ACH transfers.', 'Rail Health', 'high', 'open'),
('Manual review queue threshold reached', 'Pending review queue has reached 40 items and may delay approvals.', 'Operations', 'medium', 'open')
ON CONFLICT DO NOTHING;

-- Insert sample transfers data
INSERT INTO transfers (sender, sender_account, receiver, receiver_account, amount, fee, currency, method, status, risk, initiated_by, settled_at) VALUES
('John Doe', '****1234', 'Jane Smith', '****5678', 2500.00, 15.00, 'USD', 'ACH', 'completed', 15.50, 'john.doe@company.com', NOW() - INTERVAL '2 hours'),
('Alice Johnson', '****9012', 'Bob Wilson', '****3456', 7500.00, 25.00, 'USD', 'Wire', 'pending_review', 78.20, 'alice.johnson@company.com', NULL),
('Mike Chen', '****7890', 'Sarah Davis', '****1122', 1200.00, 8.50, 'USD', 'ACH', 'processing', 23.10, 'mike.chen@company.com', NULL),
('Emma Rodriguez', '****3344', 'David Kim', '****5566', 50000.00, 125.00, 'USD', 'SWIFT', 'completed', 45.80, 'emma.rodriguez@company.com', NOW() - INTERVAL '1 day'),
('Tom Anderson', '****7788', 'Lisa Brown', '****9900', 850.00, 5.25, 'USD', 'ACH', 'failed', 12.30, 'tom.anderson@company.com', NULL)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on alerts" ON alerts FOR ALL USING (true);
CREATE POLICY "Allow all operations on settings" ON settings FOR ALL USING (true);
CREATE POLICY "Allow all operations on transfers" ON transfers FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_alerts_state ON alerts(state);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON transfers(status);
CREATE INDEX IF NOT EXISTS idx_transfers_initiated_at ON transfers(initiated_at DESC);
CREATE INDEX IF NOT EXISTS idx_transfers_sender ON transfers(sender);
CREATE INDEX IF NOT EXISTS idx_transfers_receiver ON transfers(receiver);