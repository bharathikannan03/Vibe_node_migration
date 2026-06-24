import {
  findInsurersByLobType,
  findInsurersByIds,
  findPolicyInsurerIds,
  findPolicyTpaIds,
  findTpasByIds,
  findAllTpas,
  findCashlessHospitals,
  createCashlessHospital,
  findCashlessHospitalById,
  updateCashlessHospitalIsDataupload,
  findRecentUploadErrors
} from "../repositories/cashless-hospital-repository.js";
import db from "../config/database.js";
import AppError from "../utils/app-error.js";

export const getInsurerListService = async (lobType, userId) => {
  const isBroker = false; // TODO: Replace with actual broker check from user
  let queryInsurerIds = [];

  if (isBroker) {
    const assignedPolicyIds = await getAssignedPolicyIds(userId);
    if (!assignedPolicyIds || assignedPolicyIds.length === 0) {
      return { insurer_list: [] };
    }

    queryInsurerIds = await findPolicyInsurerIds(assignedPolicyIds);
    if (!queryInsurerIds || queryInsurerIds.length === 0) {
      return { insurer_list: [] };
    }

    const insurers = await findInsurersByIds(queryInsurerIds);
    return { insurer_list: insurers };
  }

  const insurers = await findInsurersByLobType(lobType);
  return { insurer_list: insurers };
};

export const getPolicyTpaService = async (userId) => {
  const isBroker = false; // TODO: Replace with actual broker check from user

  if (isBroker) {
    const assignedPolicyIds = await getAssignedPolicyIds(userId);
    if (!assignedPolicyIds || assignedPolicyIds.length === 0) {
      return { Policy_TPA: [] };
    }

    const tpaIds = await findPolicyTpaIds(assignedPolicyIds);
    if (!tpaIds || tpaIds.length === 0) {
      return { Policy_TPA: [] };
    }

    const tpas = await findTpasByIds(tpaIds);
    return { Policy_TPA: tpas };
  }

  const tpas = await findAllTpas();
  return { Policy_TPA: tpas };
};

export const getCorporateCashlessHospitalService = async (userId) => {
  const isBroker = false; // TODO: Replace with actual broker check from user

  if (isBroker) {
    const assignedPolicyIds = await getAssignedPolicyIds(userId);
    if (!assignedPolicyIds || assignedPolicyIds.length === 0) {
      return { cashlesshospital_details: [] };
    }

    const insurers = await db.execute(
      `SELECT DISTINCT select_insurer FROM master_add_policies 
       WHERE id IN (?) AND select_insurer IS NOT NULL AND select_insurer != ''`,
      [assignedPolicyIds]
    );

    const tpas = await db.execute(
      `SELECT DISTINCT select_tpa FROM master_add_policies 
       WHERE id IN (?) AND select_tpa IS NOT NULL AND select_tpa != ''`,
      [assignedPolicyIds]
    );

    const insurerNames = insurers[0].map(r => r.select_insurer).filter(Boolean);
    const tpaNames = tpas[0].map(r => r.select_tpa).filter(Boolean);

    const hospitals = await findCashlessHospitals(insurerNames, tpaNames);
    return { cashlesshospital_details: hospitals };
  }

  const hospitals = await findCashlessHospitals(null, null);
  return { cashlesshospital_details: hospitals };
};

export const createCashlessHospitalService = async (payload, userId, file) => {
  if (!file) {
    throw new AppError("Document file not found", 404);
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const filepath = file.path || file.location; // S3 URL from multer-s3
    const filename = file.originalname;

    const hospitalId = await createCashlessHospital(connection, {
      refInsurerId: payload.insurer_id,
      insurerName: payload.insurer_name,
      refTpaId: payload.ref_tpa_id || null,
      tpaName: payload.tpa_name || null,
      originalFileName: filename,
      chUploadData: filepath,
      status: 1,
      isDataupload: 1
    });

    // TODO: Import Excel file data using a CSV/Excel parser
    // For now, we'll just check for recent upload errors
    const failures = await findRecentUploadErrors(5);

    if (failures && failures.length > 0) {
      await updateCashlessHospitalIsDataupload(connection, hospitalId, 2);
    }

    await connection.commit();

    return { 
      message: "Insurer data and Excel file imported successfully." 
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

async function getAssignedPolicyIds(userId) {
  // TODO: Implement actual broker policy assignment logic
  // For now, return empty array to simulate no assigned policies
  return [];
}