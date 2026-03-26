CREATE TABLE IF NOT EXISTS mazadtn.bids (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lot_id uuid NOT NULL,
    user_email varchar NOT NULL,
    user_name varchar NULL,
    amount numeric(18,3) NOT NULL,
    created_at timestamp NOT NULL DEFAULT NOW()
);

ALTER TABLE mazadtn.lots
ADD COLUMN IF NOT EXISTS current_price numeric(18,3) NULL;

ALTER TABLE mazadtn.lots
ADD COLUMN IF NOT EXISTS bid_count integer NOT NULL DEFAULT 0;