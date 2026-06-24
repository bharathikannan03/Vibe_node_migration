export const validateCreateCashlessHospital = (payload) => {
  const errors = [];
  const value = {};

  if (!payload.insurer_id || typeof payload.insurer_id !== "number") {
    errors.push({ field: "insurer_id", message: "Insurer ID is required and must be a number" });
    value.insurer_id = null;
  } else {
    value.insurer_id = payload.insurer_id;
  }

  if (!payload.insurer_name || typeof payload.insurer_name !== "string" || payload.insurer_name.trim() === "") {
    errors.push({ field: "insurer_name", message: "Insurer name is required and must be a string" });
    value.insurer_name = null;
  } else {
    value.insurer_name = payload.insurer_name.trim();
  }

  if (payload.ref_tpa_id !== undefined && payload.ref_tpa_id !== null && payload.ref_tpa_id !== "") {
    value.ref_tpa_id = Number(payload.ref_tpa_id);
    if (!Number.isFinite(value.ref_tpa_id)) {
      errors.push({ field: "ref_tpa_id", message: "Ref TPA ID must be a number" });
    }
  } else {
    value.ref_tpa_id = null;
  }

  if (payload.tpa_name !== undefined && payload.tpa_name !== null && payload.tpa_name !== "") {
    value.tpa_name = payload.tpa_name.trim();
  } else {
    value.tpa_name = null;
  }

  return { value, errors };
};

export const validateGetInsurerList = (params) => {
  const errors = [];
  const value = {};

  if (params.id !== undefined && params.id !== null && params.id !== "") {
    value.lobType = Number(params.id);
    if (!Number.isFinite(value.lobType)) {
      errors.push({ field: "id", message: "LOB type must be a number" });
    }
  } else {
    value.lobType = 0;
  }

  return { value, errors };
};