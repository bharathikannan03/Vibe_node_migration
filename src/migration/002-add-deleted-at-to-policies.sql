ALTER TABLE policies
  ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL AFTER updated_at;

ALTER TABLE policies
  ADD KEY idx_policies_deleted_at (deleted_at);
