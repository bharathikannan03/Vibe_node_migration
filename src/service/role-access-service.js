import {
  findAllRoles,
  findCorporateNamesByRoleId,
  findRoleAccessMappings,
  findAllModuleDetails,
  existsRoleByName,
  createRole,
  createRoleAccessMappings
} from "../repositories/role-access-repository.js";
import db from "../config/database.js";
import AppError from "../utils/app-error.js";

const SYSTEM_ROLE_IDS = [1, 2, 3, 6, 7, 8, 9];

export const getAllRoleAccessDetailsService = async () => {
  const roles = await findAllRoles();

  if (roles.length === 0) {
    throw new AppError("Roles Access Data Not Found", 400);
  }

  const allModuleDetails = await findAllModuleDetails();

  const modulesByModuleId = allModuleDetails.reduce((acc, item) => {
    if (!acc[item.module_id]) {
      acc[item.module_id] = [];
    }
    acc[item.module_id].push(item);
    return acc;
  }, {});

  const response = [];

  for (const role of roles) {
    const corporateNames = await findCorporateNamesByRoleId(role.role_id);
    const mappedTo = corporateNames.length > 0 ? corporateNames : null;

    const existingMappings = await findRoleAccessMappings(role.role_id);

    const accessDetails = Object.entries(modulesByModuleId).map(
      ([moduleId, moduleItems]) => {
        const firstItem = moduleItems[0];

        const options = moduleItems.map((item) => {
          const mapping = existingMappings.find(
            (m) =>
              m.module_id === item.module_id &&
              m.module_option_id === item.module_option_id
          );

          return {
            option: item.module_option_name
          };
        });

        return {
          label: firstItem.module_name,
          options
        };
      }
    );

    response.push({
      role_id: role.role_id,
      role_name: role.role,
      access: accessDetails,
      mapped_to: mappedTo
    });
  }

  return response;
};

export const getRoleAccessDetailService = async () => {
  const allModuleDetails = await findAllModuleDetails();

  if (allModuleDetails.length === 0) {
    throw new AppError("Access Details Not Found", 400);
  }

  const grouped = allModuleDetails.reduce((acc, item) => {
    if (!acc[item.module_id]) {
      acc[item.module_id] = [];
    }
    acc[item.module_id].push(item);
    return acc;
  }, {});

  const response = Object.entries(grouped).map(([moduleId, items]) => {
    const firstItem = items[0];

    const option = items.map((item) => ({
      option: item.module_option_name,
      optionId: item.module_option_id
    }));

    return {
      label: firstItem.module_name,
      value: Number(moduleId),
      option
    };
  });

  return response;
};

export const verifyRoleNameService = async (roleName) => {
  const exists = await existsRoleByName(roleName);

  if (exists) {
    throw new AppError("Role Name Already Exists", 400);
  }

  return { message: "Role Name Verified" };
};

export const createRoleAccessModuleService = async (payload) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const roleId = await createRole(connection, payload.role);

    const mappings = [];
    if (payload.modules && payload.modules.length > 0) {
      for (const module of payload.modules) {
        const moduleId = module.module_id;
        const optionIds = module.module_option_ids || [];
        const selectionStatuses = module.selection_status || [];

        for (let i = 0; i < optionIds.length; i++) {
          mappings.push({
            module_id: moduleId,
            module_option_id: optionIds[i],
            selection_status: selectionStatuses[i] ?? null
          });
        }
      }
    }

    if (mappings.length > 0) {
      await createRoleAccessMappings(connection, roleId, mappings);
    }

    await connection.commit();

    return { message: "Role module access created successfully." };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
