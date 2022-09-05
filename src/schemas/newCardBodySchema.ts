import joi from "joi";

export const newCardBodySchema = joi.object({
  employeeId: joi.number().integer().required(),
  cardType: joi.string().trim().valid("groceries", "restaurant", "transport", "education", "health").required(),
});
