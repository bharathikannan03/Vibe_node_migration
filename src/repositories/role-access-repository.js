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

export const createRole = async (connection, roleName) => {
  const [result] = await connection.execute(
    `INSERT INTO md_visibility_role_id_feature_tmps (role, is_visible, created_at, updated_at)
     VALUES (?, 2, NOW(), NOW())`,
    [roleName]
  );
  return result.insertId;
};

export const createRoleAccessMappings = async (connection, roleId, mappings) => {
  if (mappings.length === 0) return;

  const placeholders = mappings.map(() => "(?, ?, ?, ?, NOW(), NOW())").join(", ");
  const values = mappings.flatMap((m) => [
    roleId,
    m.module_id,
    m.module_option_id,
    m.selection_status
  ]);

  await connection.execute(
    `INSERT INTO trn_mapping_roleid_roleaccessdetails
     (role_id, module_id, module_option_id, selection_status, created_at, updated_at)
     VALUES ${placeholders}`,
    values
  );
};
