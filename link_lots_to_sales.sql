ALTER TABLE mazadtn.lots
ADD COLUMN IF NOT EXISTS sale_id uuid NULL;

ALTER TABLE mazadtn.lots
DROP CONSTRAINT IF EXISTS lots_sale_id_fkey;

ALTER TABLE mazadtn.lots
ADD CONSTRAINT lots_sale_id_fkey
FOREIGN KEY (sale_id)
REFERENCES mazadtn.sales(id)
ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS ix_lots_sale_id ON mazadtn.lots(sale_id);