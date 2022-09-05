import joi from "joi";

export const getBalanceCardBodySchema = joi.object({
  employeeId: joi.number().integer().required(),
  securityCode: joi.string().regex(new RegExp("^[0-9]{3}")).length(3).required(),
});
