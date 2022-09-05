import { Router } from "express";
import validateJoi from "../middlewares/joiMiddleware.js";
import * as cardController from "../controllers/cardController.js";

const router = Router();

router.post("/cards/create", validateJoi("newCard"), cardController.create);
router.post("/cards/activate/:cardId", validateJoi("activateCard"), cardController.activate);
router.get("/cards/balance/:cardId", validateJoi("getBalance"), cardController.getBalance);
router.post("/cards/block/:cardId", validateJoi("blockCard"), cardController.block);
router.post("/cards/unblock/:cardId", validateJoi("blockCard"), cardController.unblock);
router.post("/cards/recharge/:cardId", validateJoi("recharge"), cardController.recharge);
router.post("/cards/transaction/:cardId", validateJoi("transaction"), cardController.transaction);

export default router;
