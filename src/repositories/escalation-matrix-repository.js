import db from "../config/database.js";

export const findAllEscalationMatrices = async () => {
  const [rows] = await db.execute(
    `SELECT * FROM master_escalation_matrices WHERE deleted_at IS NULL ORDER BY id DESC`
  );
  return rows;
};

export const findEscalationMatrixById = async (id) => {
  const [rows] = await db.execute(
    `SELECT * FROM master_escalation_matrices WHERE id = ? AND deleted_at IS NULL`,
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const createEscalationMatrix = async (connection, data) => {
  const [result] = await connection.execute(
    `INSERT INTO master_escalation_matrices
     (fullname, phone_number, mobile_number, email_id, alt_email_id, send_mail_alt_email, 
      company_fulladdress, type, type_id, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
    [data.fullname, data.phone_number, data.mobile_number, data.email_id, 
     data.alt_email_id, data.send_mail_alt_email, data.company_fulladdress, 
     data.type, data.type_id]
  );
  return result.insertId;
};

export const updateEscalationMatrix = async (connection, id, data) => {
  const [result] = await connection.execute(
    `UPDATE master_escalation_matrices SET
      fullname = ?, phone_number = ?, mobile_number = ?, email_id = ?,
      alt_email_id = ?, send_mail_alt_email = ?, company_fulladdress = ?,
      type = ?, type_id = ?, updated_at = NOW()
     WHERE id = ?`,
    [data.fullname, data.phone_number, data.mobile_number, data.email_id,
     data.alt_email_id, data.send_mail_alt_email, data.company_fulladdress,
     data.type, data.type_id, id]
  );
  return result.affectedRows;
};

export const updateEscalationMatrixUpdatedBy = async (connection, id, userId) => {
  await connection.execute(
    `UPDATE master_escalation_matrices SET updated_at = NOW() WHERE id = ?`,
    [id]
  );
};

export const deleteEscalationMatrix = async (connection, id) => {
  await connection.execute(
    `DELETE FROM master_escalation_matrices WHERE id = ?`,
    [id]
  );
};