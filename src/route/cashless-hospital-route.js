import { Router } from "express";
import {
  getInsurerList,
  getPolicyTpa,
  getCorporateCashlessHospital,
  createCashlessHospital
} from "../controller/CashlessHospitalController.js";
import validateRequest from "../middleware/validate-request.js";
import { validateCreateCashlessHospital, validateGetInsurerList } from "../validators/cashless-hospital-validator.js";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

const router = Router();

router.get("/get_insurer_lists/:id", validateRequest(validateGetInsurerList), getInsurerList);
router.get("/get_policy_tpa", getPolicyTpa);
router.get("/get_all_corporatecashless_hospital", getCorporateCashlessHospital);

// Configure multer for file upload (S3)
const s3 = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
  }
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET || "vibe-cashless-hospital",
    key: function (req, file, cb) {
      cb(null, `cashless_hospital_data/${Date.now()}-${file.originalname}`);
    }
  }),
  fileFilter: function (req, file, cb) {
    const allowedTypes = [".csv", ".xlsx", ".xls"];
    const ext = file.originalname.substring(file.originalname.lastIndexOf(".")).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV, XLSX, and XLS files are allowed"), false);
    }
  }
});

router.post("/create_cashless_hospital", upload.single("upload_data"), validateRequest(validateCreateCashlessHospital), createCashlessHospital);

export default router;