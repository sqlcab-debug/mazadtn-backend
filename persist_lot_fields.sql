ALTER TABLE mazadtn.lots
ADD COLUMN IF NOT EXISTS reference varchar(120) NULL,
ADD COLUMN IF NOT EXISTS reserve_price numeric(18,3) NULL,
ADD COLUMN IF NOT EXISTS buyer_fee_percent numeric(8,3) NULL,
ADD COLUMN IF NOT EXISTS vat_applicable boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_bidding_enabled boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_extend_minutes integer NULL,
ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;