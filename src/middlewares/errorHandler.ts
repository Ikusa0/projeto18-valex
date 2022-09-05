import { NextFunction, Request, Response } from "express";

export async function errorHandler(
  error: { code: string; message: string },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const { code, message } = error;

  if (code === "error_not_found") return res.status(404).send(message);
  if (code === "error_forbidden") return res.status(403).send(message);

  return res.sendStatus(500);
}
