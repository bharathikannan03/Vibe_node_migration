CREATE TABLE IF NOT EXISTS mapping_policy_completions (
  columns_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  policy_id INT NOT NULL,
  section_id INT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (columns_id)
);
