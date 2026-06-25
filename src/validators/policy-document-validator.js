export const validateUploadPolicyDocument = (payload) => {
  const errors = [];
  const value = {};

  if (!payload.doc_type_id || typeof payload.doc_type_id !== "number") {
    errors.push({ field: "doc_type_id", message: "Document type ID is required and must be a number" });
    value.docTypeId = null;
  } else {
    value.docTypeId = payload.doc_type_id;
  }

  if (!payload.doc_type || typeof payload.doc_type !== "string" || payload.doc_type.trim() === "") {
    errors.push({ field: "doc_type", message: "Document type is required and must be a string" });
    value.docType = null;
  } else {
    value.docType = payload.doc_type.trim();
  }

  if (!payload.doc_name_id || typeof payload.doc_name_id !== "number") {
    errors.push({ field: "doc_name_id", message: "Document name ID is required and must be a number" });
    value.docNameId = null;
  } else {
    value.docNameId = payload.doc_name_id;
  }

  if (!payload.doc_name || typeof payload.doc_name !== "string" || payload.doc_name.trim() === "") {
    errors.push({ field: "doc_name", message: "Document name is required and must be a string" });
    value.docName = null;
  } else {
    value.docName = payload.doc_name.trim();
  }

  value.note = payload.note || null;

  if (!payload.original_file_name || typeof payload.original_file_name !== "string" || payload.original_file_name.trim() === "") {
    errors.push({ field: "original_file_name", message: "Original file name is required" });
    value.originalFileName = null;
  } else {
    value.originalFileName = payload.original_file_name.trim();
  }

  if (!payload.document_file || typeof payload.document_file !== "string" || payload.document_file.trim() === "") {
    errors.push({ field: "document_file", message: "Document file path is required" });
    value.documentFile = null;
  } else {
    value.documentFile = payload.document_file.trim();
  }

  if (!payload.policy_id) {
    errors.push({ field: "policy_id", message: "Policy ID is required" });
    value.policyId = null;
  } else {
    value.policyId = Number(payload.policy_id);
    if (!Number.isFinite(value.policyId)) {
      errors.push({ field: "policy_id", message: "Policy ID must be a number" });
    }
  }

  return { value, errors };
};