CREATE TABLE IF NOT EXISTS master_cashless_hospitals (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ref_insurer_id INT NOT NULL,
  insurer_name VARCHAR(255) NOT NULL,
  ref_tpa_id INT DEFAULT NULL,
  tpa_name VARCHAR(255) DEFAULT NULL,
  ch_upload_data VARCHAR(255) NOT NULL,
  original_file_name VARCHAR(200) DEFAULT NULL,
  ref_corporate_id INT DEFAULT NULL,
  status INT NOT NULL DEFAULT '0',
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  is_dataupload INT NOT NULL DEFAULT '0',
  PRIMARY KEY (id)
);
