import {
  getAllRoleAccessDetailsService,
  getRoleAccessDetailService,
  verifyRoleNameService
} from "../service/role-access-service.js";

export const getAllRoleAccessDetails = async (req, res, next) => {
  try {
    const data = await getAllRoleAccessDetailsService();

    return res.status(200).json(data);
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
  }
};

export const getRoleAccessDetail = async (req, res, next) => {
  try {
    const data = await getRoleAccessDetailService();

    return res.status(200).json(data);
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
  }
};

export const verifyRoleName = async (req, res, next) => {
  try {
    const result = await verifyRoleNameService(req.body.role);

    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
  }
};
