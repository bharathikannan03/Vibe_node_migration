import {
  getInsurerListService,
  getPolicyTpaService,
  getCorporateCashlessHospitalService,
  createCashlessHospitalService
} from "../service/cashless-hospital-service.js";

export const getInsurerList = async (req, res, next) => {
  try {
    const userId = req.user?.id || 1;
    const lobType = Number(req.params.id) || 0;

    const result = await getInsurerListService(lobType, userId);

    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    return next(error);
  }
};

export const getPolicyTpa = async (req, res, next) => {
  try {
    const userId = req.user?.id || 1;

    const result = await getPolicyTpaService(userId);

    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    return next(error);
  }
};

export const getCorporateCashlessHospital = async (req, res, next) => {
  try {
    const userId = req.user?.id || 1;

    const result = await getCorporateCashlessHospitalService(userId);

    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    return next(error);
  }
};

export const createCashlessHospital = async (req, res, next) => {
  try {
    const userId = req.user?.id || 1;
    const file = req.file;

    const result = await createCashlessHospitalService(req.body, userId, file);

    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    if (error.statusCode === 500) {
      return res.status(500).json({ 
        message: "Error importing data.",
        error: error.message 
      });
    }
    return next(error);
  }
};