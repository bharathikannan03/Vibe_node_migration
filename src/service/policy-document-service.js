import {
  findPolicyDocumentsByPolicyId,
  createPolicyDocument,
  findPolicyDocumentById,
  findPolicyById,
  updatePolicyDocumentUpdatedBy,
  deletePolicyDocument,
  checkPolicyCompletion,
  updatePolicyStatus
} from "../repositories/policy-document-repository.js";
import db from "../config/database.js";
import AppError from "../utils/app-error.js";

const DOCUMENT_SECTION_ID = 6;

export const getPolicyDocumentsService = async (policyId) => {
  const policy = await findPolicyById(policyId);
  
  if (!policy) {
    return { policy_document: [] };
  }

  const documents = await findPolicyDocumentsByPolicyId(policyId);

  const data = documents.map((doc) => ({
    id: doc.id,
    ref_document_type_id: doc.ref_document_type_id,
    document_type: doc.document_type,
    ref_document_name_id: doc.ref_document_name_id,
    document_name: doc.document_name,
    note: doc.note,
    original_file_name: doc.original_file_name,
    document_file: doc.document_file,
    ref_policy_id: doc.ref_policy_id
  }));

  return { policy_document: data };
};

export const uploadPolicyDocumentService = async (payload, userId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const policy = await findPolicyById(payload.policyId);
    if (!policy) {
      throw new AppError("Policy not found", 404);
    }

    const docId = await createPolicyDocument(connection, {
      docTypeId: payload.docTypeId,
      docType: payload.docType,
      docNameId: payload.docNameId,
      docName: payload.docName,
      note: payload.note,
      originalFileName: payload.originalFileName,
      documentFile: payload.documentFile,
      policyId: payload.policyId
    });

    const isCompleted = await checkPolicyCompletion(payload.policyId, DOCUMENT_SECTION_ID);
    await updatePolicyStatus(connection, payload.policyId, isCompleted);

    await connection.commit();

    const document = await findPolicyDocumentById(docId);

    return {
      message: "Policy Document Uploaded successfully",
      policy_document: document,
      section_id: DOCUMENT_SECTION_ID
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const deletePolicyDocumentService = async (id, userId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const userData = await findPolicyDocumentById(id);
    if (!userData) {
      throw new AppError("Data not found", 404);
    }

    const policy = await findPolicyById(userData.ref_policy_id);
    if (!policy) {
      throw new AppError("Policy not found", 404);
    }

    await updatePolicyDocumentUpdatedBy(connection, id, userId);
    await deletePolicyDocument(connection, id);

    await connection.commit();

    return { message: "Data deleted successfully" };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};