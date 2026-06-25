CREATE TABLE IF NOT EXISTS trn_mapping_roleid_roleaccessdetails (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  role_id INT DEFAULT NULL,
  module_id INT DEFAULT NULL,
  module_option_id INT DEFAULT NULL,
  selection_status INT NOT NULL DEFAULT '0',
  status INT NOT NULL DEFAULT '0',
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id)
);
