import { Company } from "../repositories/companyRepository.js";

export function isCompany(company: Company) {
  if (!company) {
    throw { code: "error_not_found", message: "Company Not Found" };
  }
}
