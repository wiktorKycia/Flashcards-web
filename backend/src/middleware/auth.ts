import jwt from 'jsonwebtoken'
import {Request, Response, NextFunction} from 'express'

interface AuthRequest extends Request {
    user?: string | jwt.JwtPayload
}

export default (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1] // "Bearer <token>"
    if (!token)
    {
        return res.status(401).json({message: "Nie podano tokenu"})
    }

    try
    {
        req.user = jwt.verify(token, process.env.JWT_SECRET as string)
        next()
    }
    catch
    {
        res.status(401).json({message: "Nieprawidłowy token"})
    }
}