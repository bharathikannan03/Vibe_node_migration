import db from "../config/database.js";

export const findPolicyDocumentsByPolicyId = async (policyId) => {
  const [rows] = await db.execute(
    `SELECT 
        id, ref_document_type_id, document_type, ref_document_name_id, 
        document_name, note, original_file_name, document_file, ref_policy_id
     FROM master_policy_documents
     WHERE ref_policy_id = ? AND deleted_at IS NULL`,
    [policyId]
  );
  return rows;
};

export const createPolicyDocument = async (connection, data) => {
  const [result] = await connection.execute(
    `INSERT INTO master_policy_documents
     (ref_document_type_id, document_type, ref_document_name_id, document_name, 
      note, original_file_name, document_file, ref_policy_id, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())`,
    [data.docTypeId, data.docType, data.docNameId, data.docName, 
     data.note, data.originalFileName, data.documentFile, data.policyId]
  );
  return result.insertId;
};

export const findPolicyDocumentById = async (id) => {
  const [rows] = await db.execute(
    `SELECT * FROM master_policy_documents WHERE id = ?`,
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const findPolicyById = async (policyId) => {
  const [rows] = await db.execute(
    `SELECT id, ref_corporate_id FROM master_add_policies WHERE id = ?`,
    [policyId]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const updatePolicyDocumentUpdatedBy = async (connection, id, userId) => {
  await connection.execute(
    `UPDATE master_policy_documents SET updated_at = NOW() WHERE id = ?`,
    [id]
  );
};

export const deletePolicyDocument = async (connection, id) => {
  await connection.execute(
    `DELETE FROM master_policy_documents WHERE id = ?`,
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