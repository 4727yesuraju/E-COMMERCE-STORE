import express from "express"
import { adminRoute, protechRoute } from "../middleware/auth.middleware.js";
import { dataForCarts} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/",protechRoute, adminRoute, dataForCarts)

export default router;