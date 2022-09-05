import { Business } from "../repositories/businessRepository";
import { TransactionTypes } from "../repositories/cardRepository.js";

export function isBusiness(business: Business) {
  if (!business) {
    throw { code: "error_not_found", message: "Business Not Found" };
  }
}

export function businessType(business: Business, cardType: TransactionTypes) {
  if (business.type !== cardType) {
    throw { code: "error_forbidden", message: "Business Is Not Of Same Type As Card" };
  }
}
