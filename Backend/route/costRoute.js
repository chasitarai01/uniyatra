import express from "express";
import { getCostConfigs, updateCostConfig } from "../controller/costController.js";

const router = express.Router();

router.get("/", getCostConfigs);
router.post("/update", updateCostConfig);

export default router;
