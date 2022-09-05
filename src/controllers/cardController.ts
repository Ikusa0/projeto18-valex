import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import * as cardService from "../services/cardService.js";

export async function create(req: Request, res: Response) {
  const apiKey = String(req.headers["x-api-key"]);
  const { employeeId, cardType }: { employeeId: number; cardType: TransactionTypes } = req.body;

  const cardId = await cardService.create(apiKey, employeeId, cardType);
  res.status(201).send(cardId);
}

export async function activate(req: Request, res: Response) {
  const cardId: number = Number(req.params["cardId"]);
  const { employeeId, securityCode, password }: { employeeId: number; securityCode: string; password: string } =
    req.body;

  await cardService.activate(cardId, employeeId, securityCode, password);
  res.sendStatus(200);
}

export async function getBalance(req: Request, res: Response) {
  const cardId: number = Number(req.params["cardId"]);
  const { employeeId, securityCode }: { employeeId: number; securityCode: string } = req.body;
  const balance = await cardService.getBalance(cardId, employeeId, securityCode);

  res.send(balance);
}

export async function block(req: Request, res: Response) {
  const cardId: number = Number(req.params["cardId"]);
  const { employeeId, securityCode, password }: { employeeId: number; securityCode: string; password: string } =
    req.body;

  await cardService.block(cardId, employeeId, securityCode, password);
  res.sendStatus(200);
}

export async function unblock(req: Request, res: Response) {
  const cardId: number = Number(req.params["cardId"]);
  const { employeeId, securityCode, password }: { employeeId: number; securityCode: string; password: string } =
    req.body;

  await cardService.unblock(cardId, employeeId, securityCode, password);
  res.sendStatus(200);
}

export async function recharge(req: Request, res: Response) {
  const cardId: number = Number(req.params["cardId"]);
  const apiKey = String(req.headers["x-api-key"]);
  const { amount }: { amount: number } = req.body;

  await cardService.recharge(apiKey, cardId, amount);
  res.sendStatus(201);
}

export async function transaction(req: Request, res: Response) {
  const cardId: number = Number(req.params["cardId"]);
  const { amount, password, businessId }: { amount: number; password: string; businessId: number } = req.body;

  await cardService.transaction(cardId, password, amount, businessId);
  res.sendStatus(201);
}
