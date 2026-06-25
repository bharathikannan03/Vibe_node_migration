import {
  getAllEscalationMatrixService,
  getEscalationMatrixByIdService,
  storeEscalationMatrixService,
  deleteEscalationMatrixService
} from "../service/escalation-matrix-service.js";

export const getAllEscalationMatrix = async (req, res, next) => {
  try {
    const result = await getAllEscalationMatrixService();
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export const getEscalationMatrixById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const result = await getEscalationMatrixByIdService(id);
    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    return next(error);
  }
};

export const storeEscalationMatrix = async (req, res, next) => {
  try {
    const userId = req.user?.id || 1;
    const id = req.params.id ? Number(req.params.id) : null;

    if (id !== null && !Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const result = await storeEscalationMatrixService(id, req.body, userId);
    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    return next(error);
  }
};

export const deleteEscalationMatrix = async (req, res, next) => {
  try {
    const userId = req.user?.id || 1;
    const id = Number(req.params.id);

    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const result = await deleteEscalationMatrixService(id, userId);
    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: error.message });
    }
    return next(error);
  }
};