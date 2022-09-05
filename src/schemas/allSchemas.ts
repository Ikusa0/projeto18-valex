import { newCardBodySchema } from "./newCardBodySchema.js";
import { activateCardBodySchema } from "./activateCardBodySchema.js";
import { getBalanceCardBodySchema } from "./getBalanceCardBodySchema.js";
import { rechargeBodySchema } from "./rechargeBodySchema.js";
import { transactionBodySchema } from "./transactionBodySchema.js";

export default {
  newCard: newCardBodySchema,
  activateCard: activateCardBodySchema,
  getBalance: getBalanceCardBodySchema,
  blockCard: activateCardBodySchema,
  recharge: rechargeBodySchema,
  transaction: transactionBodySchema,
};
