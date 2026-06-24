export const validateStoreEscalationMatrix = (payload) => {
  const errors = [];
  const value = {};

  if (!payload.fullname || typeof payload.fullname !== "string" || payload.fullname.trim() === "") {
    errors.push({ field: "fullname", message: "Full name is required" });
    value.fullname = null;
  } else {
    value.fullname = payload.fullname.trim();
  }

  if (!payload.mobile_number || typeof payload.mobile_number !== "string" || payload.mobile_number.trim() === "") {
    errors.push({ field: "mobile_number", message: "Mobile number is required" });
    value.mobile_number = null;
  } else {
    value.mobile_number = payload.mobile_number.trim();
  }

  if (!payload.email_id || typeof payload.email_id !== "string" || payload.email_id.trim() === "") {
    errors.push({ field: "email_id", message: "Email ID is required" });
    value.email_id = null;
  } else {
    value.email_id = payload.email_id.trim();
  }

  if (payload.phone_number !== undefined && payload.phone_number !== null && payload.phone_number !== "") {
    value.phone_number = payload.phone_number.trim();
  } else {
    value.phone_number = null;
  }

  if (payload.alt_email_id !== undefined && payload.alt_email_id !== null && payload.alt_email_id !== "") {
    value.alt_email_id = payload.alt_email_id.trim();
  } else {
    value.alt_email_id = null;
  }

  if (payload.send_mail_alt_email !== undefined) {
    value.send_mail_alt_email = Boolean(payload.send_mail_alt_email);
  } else {
    value.send_mail_alt_email = false;
  }

  if (payload.company_fulladdress !== undefined && payload.company_fulladdress !== null && payload.company_fulladdress !== "") {
    value.company_fulladdress = payload.company_fulladdress.trim();
  } else {
    value.company_fulladdress = null;
  }

  if (payload.type !== undefined && payload.type !== null && payload.type !== "") {
    value.type = payload.type.trim();
  } else {
    value.type = null;
  }

  if (payload.type_id !== undefined && payload.type_id !== null && payload.type_id !== "") {
    value.type_id = Number(payload.type_id);
    if (!Number.isFinite(value.type_id)) {
      errors.push({ field: "type_id", message: "Type ID must be a number" });
    }
  } else {
    value.type_id = null;
  }

  return { value, errors };
};