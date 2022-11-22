/**
 * @swagger
 *
 * components:
 *  securitySchemes:
 *      ApiKeyAuth:
 *          type: apiKey
 *          in: header
 *          name: Authorization
 */
import crypto from "crypto";
import express, { NextFunction, Request, Response } from "express";

const tokens: { [key: string]: boolean } = {};

const auth = express();

export function checkSession(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.header("authorization");

  if (!apiKey)
    return res
      .status(403)
      .json({ error: "Unauthorized: Missing Authorization header" });

  if (!tokens[apiKey]) return res.status(403).json({ error: "Unauthorized" });

  next();
}

/**
 * @swagger
 *
 * /auth:
 *  post:
 *    summary: Authorize the user and create a token
 *    responses:
 *      200:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          apiKey:
 *                              type: string
 */
auth.post("/", (req, res) => {
  const newToken = crypto
    .createHash("sha256")
    .update(Math.random().toString())
    .digest("base64");

  tokens[newToken] = true;

  res.json({ apiKey: newToken });
});

export default auth;
