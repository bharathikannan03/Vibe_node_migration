import db from "../config/database.js";

export const findInsurersByLobType = async (lobType) => {
  let query = `SELECT id, name FROM md_insurer_lists WHERE status = 1`;
  const params = [];

  if (lobType !== undefined && lobType !== null && lobType !== 0) {
    query += ` AND LOB_type = ?`;
    params.push(lobType);
  }

  const [rows] = await db.execute(query, params);
  return rows;
};

export const findInsurersByIds = async (insurerIds) => {
  if (!insurerIds || insurerIds.length === 0) return [];
  
  const placeholders = insurerIds.map(() => "?").join(", ");
  const [rows] = await db.execute(
    `SELECT id, name FROM md_insurer_lists WHERE id IN (${placeholders}) AND status = 1`,
    insurerIds
  );
  return rows;
};

export const findPolicyInsurerIds = async (policyIds) => {
  if (!policyIds || policyIds.length === 0) return [];
  
  const placeholders = policyIds.map(() => "?").join(", ");
  const [rows] = await db.execute(
    `SELECT DISTINCT ref_select_insurer_id as id FROM master_add_policies 
     WHERE id IN (${placeholders}) AND ref_select_insurer_id IS NOT NULL`,
    policyIds
  );
  return rows.map(r => r.id);
};

export const findPolicyTpaIds = async (policyIds) => {
  if (!policyIds || policyIds.length === 0) return [];
  
  const placeholders = policyIds.map(() => "?").join(", ");
  const [rows] = await db.execute(
    `SELECT DISTINCT ref_tpa_id as id FROM master_add_policies 
     WHERE id IN (${placeholders}) AND ref_tpa_id IS NOT NULL`,
    policyIds
  );
  return rows.map(r => r.id);
};

export const findTpasByIds = async (tpaIds) => {
  if (!tpaIds || tpaIds.length === 0) return [];
  
  const placeholders = tpaIds.map(() => "?").join(", ");
  const [rows] = await db.execute(
    `SELECT id, name FROM md_policy_tpas WHERE id IN (${placeholders}) AND status = 1`,
    tpaIds
  );
  return rows;
};

export const findAllTpas = async () => {
  const [rows] = await db.execute(
    `SELECT id, name FROM md_policy_tpas WHERE status = 1`
  );
  return rows;
};

export const findCashlessHospitals = async (insurerNames, tpaNames) => {
  let query = `SELECT * FROM master_cashless_hospitals WHERE deleted_at IS NULL`;
  const params = [];

  if (insurerNames && insurerNames.length > 0) {
    const placeholders = insurerNames.map(() => "?").join(", ");
    query += ` AND insurer_name IN (${placeholders})`;
    params.push(...insurerNames);
  }

  if (tpaNames && tpaNames.length > 0) {
    const placeholders = tpaNames.map(() => "?").join(", ");
    query += ` AND tpa_name IN (${placeholders})`;
    params.push(...tpaNames);
  }

  query += ` ORDER BY id DESC`;

  const [rows] = await db.execute(query, params);
  return rows;
};

export const createCashlessHospital = async (connection, data) => {
  const [result] = await connection.execute(
    `INSERT INTO master_cashless_hospitals
     (ref_insurer_id, insurer_name, ref_tpa_id, tpa_name, 
      original_file_name, ch_upload_data, status, is_dataupload, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [data.refInsurerId, data.insurerName, data.refTpaId, data.tpaName,
     data.originalFileName, data.chUploadData, data.status, data.isDataupload]
  );
  return result.insertId;
};

export const findCashlessHospitalById = async (id) => {
  const [rows] = await db.execute(
    `SELECT * FROM master_cashless_hospitals WHERE id = ?`,
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const updateCashlessHospitalIsDataupload = async (connection, id, isDataupload) => {
  await connection.execute(
    `UPDATE master_cashless_hospitals SET is_dataupload = ?, updated_at = NOW() WHERE id = ?`,
    [isDataupload, id]
  );
};

export const findRecentUploadErrors = async (seconds = 5) => {
  const [rows] = await db.execute(
    `SELECT * FROM master_cashlesshospital_upload_errors 
     WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? SECOND)`,
    [seconds]
  );
  return rows;
};