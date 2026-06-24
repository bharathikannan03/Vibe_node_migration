import {
  createPolicyEMService,
  getEMSelectUsersService,
  deleteEMUserService
} from "../service/policy-escalation-service.js";

export const createPolicyEM = async (req, res, next) => {
  try {
    const userId = req.user?.id || 1;

    const result = await createPolicyEMService(req.body, userId);

    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode === 400 || error.statusCode === 404) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return next(error);
  }
};

export const getEMSelectUsers = async (req, res, next) => {
  try {
    const result = await getEMSelectUsersService();

    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    return next(error);
  }
};

export const deleteEMUser = async (req, res, next) => {
  try {
    const userId = req.user?.id || 1;
    const emUserId = Number(req.params.EMuserId);

    if (!Number.isFinite(emUserId)) {
      return res.status(400).json({ message: "Invalid EM user ID" });
    }

    const result = await deleteEMUserService(emUserId, userId);

    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
  }
};
