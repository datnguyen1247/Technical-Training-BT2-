const jwt = require('jsonwebtoken');
import { NextFunction, Request, Response } from "express";

function verifySessionToken(req:Request, res:Response, next:NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized');
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.API_SECRET_KEY);
    next();
  } catch (error) {
    return res.status(401).send('Unauthorized');
  }
}

export default verifySessionToken
