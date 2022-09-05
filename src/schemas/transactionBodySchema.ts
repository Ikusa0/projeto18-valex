import joi from "joi";

export const transactionBodySchema = joi.object({
  amount: joi.number().positive().required(),
  password: joi.string().regex(new RegExp("^[0-9]{4}")).length(4).required(),
  businessId: joi.number().required(),
});
