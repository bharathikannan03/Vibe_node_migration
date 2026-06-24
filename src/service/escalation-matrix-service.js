import {
  findAllEscalationMatrices,
  findEscalationMatrixById,
  createEscalationMatrix,
  updateEscalationMatrix,
  updateEscalationMatrixUpdatedBy,
  deleteEscalationMatrix
} from "../repositories/escalation-matrix-repository.js";
import db from "../config/database.js";
import AppError from "../utils/app-error.js";

export const getAllEscalationMatrixService = async () => {
  const matrices = await findAllEscalationMatrices();
  return { get_EscalationMatrix_Data: matrices };
};

export const getEscalationMatrixByIdService = async (id) => {
  const matrix = await findEscalationMatrixById(id);
  if (!matrix) {
    throw new AppError("Data not found", 404);
  }
  return { EscalationMatrix_Data: matrix };
};

export const storeEscalationMatrixService = async (id, payload, userId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const data = {
      fullname: payload.fullname,
      phone_number: payload.phone_number || null,
      mobile_number: payload.mobile_number,
      email_id: payload.email_id,
      alt_email_id: payload.alt_email_id || null,
      send_mail_alt_email: payload.send_mail_alt_email ? 1 : 0,
      company_fulladdress: payload.company_fulladdress || null,
      type: payload.type || null,
      type_id: payload.type_id || null
    };

    let resultId;
    if (id) {
      const affectedRows = await updateEscalationMatrix(connection, id, data);
      if (affectedRows === 0) {
        throw new AppError("Data not found", 404);
      }
      resultId = id;
    } else {
      resultId = await createEscalationMatrix(connection, data);
    }

    await connection.commit();

    return { message: "Escalation Matrix data created successfully" };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const deleteEscalationMatrixService = async (id, userId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const matrix = await findEscalationMatrixById(id);
    if (!matrix) {
      throw new AppError("Data not found", 404);
    }

    await updateEscalationMatrixUpdatedBy(connection, id, userId);
    await deleteEscalationMatrix(connection, id);

    await connection.commit();

    return { message: "Data deleted successfully" };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};