CREATE TABLE IF NOT EXISTS trn_mapping_corporateid_corporatecontactsids (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  corporate_id INT NOT NULL,
  corporatecontacts_id INT NOT NULL,
  status INT NOT NULL DEFAULT '0',
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id)
);
