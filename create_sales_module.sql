CREATE TABLE IF NOT EXISTS mazadtn.sales (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title varchar(200) NOT NULL,
    slug varchar(220) NOT NULL UNIQUE,
    description text NULL,
    seller_name varchar(180) NULL,
    status varchar(30) NOT NULL DEFAULT 'draft',
    starts_at timestamp NULL,
    ends_at timestamp NULL,
    deposit_amount numeric(18,3) NULL,
    is_featured boolean NOT NULL DEFAULT false,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

ALTER TABLE mazadtn.lots
ADD COLUMN IF NOT EXISTS sale_id uuid NULL;

ALTER TABLE mazadtn.lots
DROP CONSTRAINT IF EXISTS lots_sale_id_fkey;

ALTER TABLE mazadtn.lots
ADD CONSTRAINT lots_sale_id_fkey
FOREIGN KEY (sale_id)
REFERENCES mazadtn.sales(id)
ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS ix_sales_status ON mazadtn.sales(status);
CREATE INDEX IF NOT EXISTS ix_sales_starts_at ON mazadtn.sales(starts_at);
CREATE INDEX IF NOT EXISTS ix_lots_sale_id ON mazadtn.lots(sale_id);