import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

module.exports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.get('Authorization');
    let token = '';

    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
      // Elimina la palabra clave "Bearer" antes de asignar el token
      token = authorization.substring(7);
    }
    console.log("Token:", token);

    const decodedToken = await jwt.verify(token, process.env.SECRETWORD);
    console.log(decodedToken);
    if (!token || !decodedToken.id || decodedToken.role !== 'Admin') {
      return res.status(401).json({ error: 'Token missing or invalid' });
    }

    const { id } = decodedToken;
    req.user = id;
    next();
  } catch (error) {
    return res.status(401).send(error);
  }
};
