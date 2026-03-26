CREATE TABLE IF NOT EXISTS mazadtn.activity_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    action varchar NULL,
    entity varchar NULL,
    entity_id varchar NULL,
    user_email varchar NULL,
    user_name varchar NULL,
    details text NULL,
    metadata jsonb NULL,
    created_at timestamp NOT NULL DEFAULT NOW()
);