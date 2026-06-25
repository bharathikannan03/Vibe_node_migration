CREATE TABLE IF NOT EXISTS master_policy_escalation_matrices (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ref_escalation_matrices_level_id INT DEFAULT NULL,
  level VARCHAR(100) DEFAULT NULL,
  ref_master_users_id INT DEFAULT NULL,
  ref_user_fullname VARCHAR(100) DEFAULT NULL,
  ref_policy_id INT DEFAULT NULL,
  status INT DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id)
);
