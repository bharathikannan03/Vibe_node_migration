import db from "../config/database.js";

const EXCLUDED_ROLE_IDS = [1, 2, 3, 6, 7, 8, 9];

export const findAllRoles = async () => {
  const placeholders = EXCLUDED_ROLE_IDS.map(() => "?").join(", ");
  const [rows] = await db.execute(
    `SELECT role_id, role FROM md_visibility_role_id_feature_tmps WHERE role_id NOT IN (${placeholders})`,
    EXCLUDED_ROLE_IDS
  );
  return rows;
};

export const findCorporateNamesByRoleId = async (roleId) => {
  const [rows] = await db.execute(
    `SELECT DISTINCT m.corporate_name
     FROM users u
     LEFT JOIN trn_mapping_corporateid_corporatecontactsids tmc
       ON u.id = tmc.corporatecontacts_id
     LEFT JOIN master_corporates m
       ON tmc.corporate_id = m.corporate_id
     WHERE u.ref_md_department_id = ?
       AND m.corporate_name IS NOT NULL`,
    [roleId]
  );
  return rows.map((row) => row.corporate_name);
};

export const findRoleAccessMappings = async (roleId) => {
  const [rows] = await db.execute(
    `SELECT module_id, module_option_id, selection_status
     FROM trn_mapping_roleid_roleaccessdetails
     WHERE role_id = ? AND selection_status = 1`,
    [roleId]
  );
  return rows;
};

export const existsRoleByName = async (roleName) => {
  const [rows] = await db.execute(
    `SELECT 1 FROM md_visibility_role_id_feature_tmps WHERE role = ? LIMIT 1`,
    [roleName]
  );
  return rows.length > 0;
};

export const findAllModuleDetails = async () => {
  const [rows] = await db.execute(
    `SELECT module_id, module_name, module_option_id, module_option_name
     FROM md_role_accessdetails`
  );
  return rows;
};
