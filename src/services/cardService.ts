import dotenv from "dotenv";
dotenv.config();
import dayjs from "dayjs";
import customParse from "dayjs/plugin/customParseFormat.js";
import Cryptr from "cryptr";
import { faker } from "@faker-js/faker";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { TransactionTypes, CardInsertData, Card } from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as employeeService from "../services/employeeService.js";
import * as companyService from "../services/companyService.js";
import * as businessService from "../services/businessService.js";
dayjs.extend(customParse);
const cryptr = new Cryptr(process.env.CRYPTR_SECRET!);

export async function create(apiKey: string, employeeId: number, cardType: TransactionTypes) {
  const employee = await employeeRepository.findById(employeeId);
  employeeService.isEmployee(employee);

  const company = await companyRepository.findByApiKey(apiKey);
  companyService.isCompany(company);

  await blockTwoCardsOfSameType(employeeId, cardType);

  const cardData: CardInsertData = {
    employeeId,
    number: generateCardNumber(),
    cardholderName: generateCardName(employee.fullName),
    securityCode: generateEncryptedCardCVV(),
    expirationDate: generateCardExpirationDate(),
    isVirtual: false,
    isBlocked: false,
    type: cardType,
  };

  return await cardRepository.insert(cardData);
}

export async function activate(cardId: number, employeeId: number, securityCode: string, password: string) {
  const card = await cardRepository.findById(cardId);
  cardExists(card);
  checkOwner(employeeId, card);
  checkSecurityCode(securityCode, card);
  isCardExpired(card);
  isCardAlreadyActivated(card);

  const newCardData = {
    password: encryptString(password),
  };

  await cardRepository.update(cardId, newCardData);
}

export async function getBalance(cardId: number, employeeId: number, securityCode: string) {
  const card = await cardRepository.findById(cardId);
  cardExists(card);
  checkOwner(employeeId, card);
  checkSecurityCode(securityCode, card);

  const transactions = await paymentRepository.findByCardId(cardId);
  const recharges = await rechargeRepository.findByCardId(cardId);
  const balance = await getTotalBalance(cardId);

  return { balance, transactions, recharges };
}

export async function block(cardId: number, employeeId: number, securityCode: string, password: string) {
  const card = await cardRepository.findById(cardId);
  cardExists(card);
  checkOwner(employeeId, card);
  checkPassword(password, card);
  checkSecurityCode(securityCode, card);
  isCardExpired(card);
  cardActivated(card);
  isCardAlreadyBlocked(card);

  const newCardData = {
    isBlocked: true,
  };

  await cardRepository.update(cardId, newCardData);
}

export async function unblock(cardId: number, employeeId: number, securityCode: string, password: string) {
  const card = await cardRepository.findById(cardId);
  cardExists(card);
  checkOwner(employeeId, card);
  checkPassword(password, card);
  checkSecurityCode(securityCode, card);
  isCardExpired(card);
  cardActivated(card);
  cardBlocked(card);

  const newCardData = {
    isBlocked: false,
  };

  await cardRepository.update(cardId, newCardData);
}

export async function recharge(apiKey: string, cardId: number, amount: number) {
  const company = await companyRepository.findByApiKey(apiKey);
  companyService.isCompany(company);
  const card = await cardRepository.findById(cardId);
  cardExists(card);
  isCardExpired(card);
  cardActivated(card);
  isCardAlreadyBlocked(card);

  await rechargeRepository.insert({ cardId, amount });
}

export async function transaction(cardId: number, password: string, amount: number, businessId: number) {
  const card = await cardRepository.findById(cardId);
  const business = await businessRepository.findById(businessId);
  cardExists(card);
  checkPassword(password, card);
  isCardExpired(card);
  cardActivated(card);
  isCardAlreadyBlocked(card);
  businessService.isBusiness(business);
  businessService.businessType(business, card.type);
  await cardHasEnoughBalance(amount, cardId);

  await paymentRepository.insert({ cardId, businessId, amount });
}

// -----------------------------------------------------------------------------------------------

function encryptString(str: string) {
  return cryptr.encrypt(str);
}

function decryptString(str: string) {
  return cryptr.decrypt(str);
}

async function blockTwoCardsOfSameType(employeeId: number, type: TransactionTypes) {
  const card = await cardRepository.findByTypeAndEmployeeId(type, employeeId);

  if (card) {
    throw { code: "error_forbidden", message: "Employees Can Not Have 2 Cards of Same Type" };
  }
}

function generateCardName(name: string): string {
  const splittedName: string[] = name.split(" ");
  if (splittedName.length <= 2) {
    return splittedName.join(" ").toUpperCase();
  }
  for (let i = 1; i < splittedName.length - 1; i++) {
    splittedName[i] = splittedName[i][0];
  }
  return splittedName.join(" ").toUpperCase();
}

function generateCardExpirationDate(): string {
  return dayjs().add(5, "years").format("MM/YY");
}

function generateCardNumber(): string {
  return faker.finance.creditCardNumber("mastercard");
}

function generateEncryptedCardCVV(): string {
  const cvv = faker.finance.creditCardCVV();
  console.log(cvv);
  return encryptString(cvv);
}

function cardExists(card: Card) {
  if (!card) {
    throw { code: "error_not_found", message: "Card ID Does Not Exist" };
  }
}

function isCardExpired(card: Card) {
  const today = dayjs(dayjs(), "MM/YY");
  const expiration = dayjs(card.expirationDate, "MM/YY");
  const isExpired: boolean = expiration.isBefore(today);
  if (isExpired) {
    throw { code: "error_forbidden", message: "Card Is Expired" };
  }
}

function isCardAlreadyActivated(card: Card) {
  if (card.password) {
    throw { code: "error_forbidden", message: "Card is Already Activated" };
  }
}

function cardActivated(card: Card) {
  if (!card.password) {
    throw { code: "error_forbidden", message: "Card Is Not Activated" };
  }
}

function isCardAlreadyBlocked(card: Card) {
  if (card.isBlocked) {
    throw { code: "error_forbidden", message: "Card Is Already Blocked" };
  }
}

function cardBlocked(card: Card) {
  if (!card.isBlocked) {
    throw { code: "error_forbidden", message: "Card Is Already Unblocked" };
  }
}

function checkSecurityCode(securityCode: string, card: Card) {
  const decryptedSecurityCode = decryptString(card.securityCode);
  if (decryptedSecurityCode !== securityCode) {
    throw { code: "error_forbidden", message: "Incorrect Security Code" };
  }
}

function checkPassword(password: string, card: Card) {
  const decryptedPassword = decryptString(card.password!);
  if (decryptedPassword !== password) {
    throw { code: "error_forbidden", message: "Incorrect Password" };
  }
}

function checkOwner(employeeId: number, card: Card) {
  if (employeeId !== card.employeeId) {
    throw { code: "error_forbidden", message: "An Unknown Error Occurred" };
  }
}

function getTotalAmount(arr: { amount: number }[]) {
  return arr.reduce((sum, value) => sum + value.amount, 0);
}

async function getTotalBalance(cardId: number) {
  const transactions = await paymentRepository.findByCardId(cardId);
  const recharges = await rechargeRepository.findByCardId(cardId);
  return getTotalAmount(recharges) - getTotalAmount(transactions);
}

async function cardHasEnoughBalance(amount: number, cardId: number) {
  const balance = await getTotalBalance(cardId);
  if (balance - amount < 0) {
    throw { code: "error_forbidden", message: "Not Enough Balance" };
  }
}
