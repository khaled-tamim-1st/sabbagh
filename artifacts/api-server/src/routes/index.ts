import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import adminRouter from "./admin";
import painterRouter from "./painter";
import publicRouter from "./public";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/painter", painterRouter);
router.use("/public", publicRouter);

export default router;
