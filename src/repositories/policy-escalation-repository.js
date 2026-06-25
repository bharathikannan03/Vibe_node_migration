import db from "../config/database.js";

export const createPolicyEscalationMatrix = async (connection, data) => {
  const [result] = await connection.execute(
    `INSERT INTO master_policy_escalation_matrices
     (ref_policy_id, ref_escalation_matrices_level_id, level, ref_master_users_id, ref_user_fullname, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [data.policyId, data.levelId, data.level, data.userId, data.userFullname, 1]
  );
  return result.insertId;
};

export const findEscalationMatricesByPolicyId = async (policyId) => {
  const [rows] = await db.execute(
    `SELECT 
        mpm.*,
        mem.phone_number,
        mem.mobile_number,
        mem.email_id,
        mem.company_fulladdress,
        mem.type
     FROM master_policy_escalation_matrices mpm
     LEFT JOIN master_escalation_matrices mem
       ON mpm.ref_master_users_id = mem.id
     WHERE mpm.ref_policy_id = ?`,
    [policyId]
  );
  return rows;
};

export const findAllEscalationMatrixUsers = async () => {
  const [rows] = await db.execute(
    `SELECT id, fullname FROM master_escalation_matrices`
  );
  return rows;
};

export const findPolicyEscalationMatrixById = async (id) => {
  const [rows] = await db.execute(
    `SELECT * FROM master_policy_escalation_matrices WHERE id = ?`,
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const updatePolicyEscalationMatrixUpdatedBy = async (connection, id, userId) => {
  await connection.execute(
    `UPDATE master_policy_escalation_matrices SET updated_at = NOW() WHERE id = ?`,
    [id]
  );
};

export const deletePolicyEscalationMatrix = async (connection, id) => {
  await connection.execute(
    `DELETE FROM master_policy_escalation_matrices WHERE id = ?`,
    [id]
  );
};

export const checkPolicyCompletion = async (policyId, sectionId) => {
  const [rows] = await db.execute(
    `SELECT COUNT(*) as count FROM mapping_policy_completions WHERE policy_id = ? AND section_id = ?`,
    [policyId, sectionId]
  );
  return rows[0].count > 0 ? 1 : 0;
};

export const updatePolicyStatus = async (connection, policyId, status) => {
  await connection.execute(
    `UPDATE master_add_policies SET status = ?, updated_at = NOW() WHERE id = ?`,
    [status, policyId]
  );
};

export const findPolicyById = async (policyId) => {
  const [rows] = await db.execute(
    `SELECT id FROM master_add_policies WHERE id = ?`,
    [policyId]
  );
  return rows.length > 0 ? rows[0] : null;
};