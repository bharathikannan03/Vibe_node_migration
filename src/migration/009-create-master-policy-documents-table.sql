CREATE TABLE IF NOT EXISTS master_policy_documents (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ref_document_type_id INT NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  ref_document_name_id INT NOT NULL,
  document_name VARCHAR(100) NOT NULL,
  note TEXT,
  document_file VARCHAR(255) NOT NULL,
  original_file_name VARCHAR(200) DEFAULT NULL,
  ref_policy_id INT NOT NULL,
  status INT NOT NULL DEFAULT '0',
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id)
);
