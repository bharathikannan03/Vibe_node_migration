import {
  createPolicyEscalationMatrix,
  findEscalationMatricesByPolicyId,
  findAllEscalationMatrixUsers,
  findPolicyEscalationMatrixById,
  updatePolicyEscalationMatrixUpdatedBy,
  deletePolicyEscalationMatrix,
  checkPolicyCompletion,
  updatePolicyStatus,
  findPolicyById
} from "../repositories/policy-escalation-repository.js";
import db from "../config/database.js";
import AppError from "../utils/app-error.js";

const EM_SECTION_ID = 5;

export const createPolicyEMService = async (payload, userId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const policy = await findPolicyById(payload.policyId);
    if (!policy) {
      throw new AppError("Policy not found", 404);
    }

    for (const em of payload.em_level) {
      await createPolicyEscalationMatrix(connection, {
        policyId: payload.policyId,
        levelId: em.level_id,
        level: em.level,
        userId: em.user_id,
        userFullname: em.user_fullname
      });
    }

    const isCompleted = await checkPolicyCompletion(payload.policyId, EM_SECTION_ID);
    await updatePolicyStatus(connection, payload.policyId, isCompleted);

    await connection.commit();

    const emleveldata = await findEscalationMatricesByPolicyId(payload.policyId);

    return {
      message: "Policy EM created successfully",
      policy_escalation_matrix: emleveldata,
      section_id: EM_SECTION_ID
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getEMSelectUsersService = async () => {
  const users = await findAllEscalationMatrixUsers();

  if (!users || users.length === 0) {
    throw new AppError("Users not found", 404);
  }

  return { User: users };
};

export const deleteEMUserService = async (id, userId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const userData = await findPolicyEscalationMatrixById(id);
    if (!userData) {
      throw new AppError("User not found", 400);
    }

    await updatePolicyEscalationMatrixUpdatedBy(connection, id, userId);
    await deletePolicyEscalationMatrix(connection, id);

    await connection.commit();

    return { message: "User deleted successfully" };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};