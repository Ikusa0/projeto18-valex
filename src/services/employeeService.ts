import { Employee } from "../repositories/employeeRepository.js";

export function isEmployee(employee: Employee) {
  if (!employee) {
    throw { code: "error_not_found", message: "Employee Not Found" };
  }
}
