import express from "express";
import authRouter from "./auth.router.js";
import adminRouter from "./admin.router.js";

const rootRouter = express.Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/admin', adminRouter);

export default rootRouter;