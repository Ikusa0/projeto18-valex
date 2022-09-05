import { Router } from "express";
import cardRouter from "./cardRouter.js";

const serverRouter = Router();

serverRouter.use(cardRouter);

export default serverRouter;
