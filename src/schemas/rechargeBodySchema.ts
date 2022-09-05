import joi from "joi";

export const rechargeBodySchema = joi.object({
  amount: joi.number().positive().required(),
});
