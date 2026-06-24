export const validateCreateRoleAccessModule = (payload) => {
  const errors = [];
  const value = {};

  if (!payload.role || typeof payload.role !== "string" || payload.role.trim() === "") {
    errors.push({ field: "role", message: "Role is required" });
    value.role = null;
  } else {
    value.role = payload.role.trim();
  }

  if (payload.modules !== undefined && payload.modules !== null) {
    if (!Array.isArray(payload.modules)) {
      errors.push({ field: "modules", message: "Modules must be an array" });
      value.modules = [];
    } else {
      value.modules = payload.modules.map((module, index) => {
        const validated = {};

        if (module.module_id !== undefined && module.module_id !== null) {
          validated.module_id = Number(module.module_id);
          if (!Number.isFinite(validated.module_id)) {
            errors.push({ field: `modules[${index}].module_id`, message: "Module ID must be a number" });
          }
        } else {
          validated.module_id = null;
        }

        if (module.module_option_ids !== undefined && module.module_option_ids !== null) {
          if (!Array.isArray(module.module_option_ids)) {
            errors.push({ field: `modules[${index}].module_option_ids`, message: "Module option IDs must be an array" });
            validated.module_option_ids = [];
          } else {
            validated.module_option_ids = module.module_option_ids.map((id) => Number(id));
          }
        } else {
          validated.module_option_ids = [];
        }

        if (!module.selection_status || !Array.isArray(module.selection_status)) {
          errors.push({ field: `modules[${index}].selection_status`, message: "Selection status is required and must be an array" });
          validated.selection_status = [];
        } else {
          validated.selection_status = module.selection_status.map((s) => (s !== null ? Number(s) : null));
        }

        return validated;
      });
    }
  } else {
    value.modules = [];
  }

  return { value, errors };
};
