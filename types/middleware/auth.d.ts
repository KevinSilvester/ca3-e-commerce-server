import { Request, Response , NextFunction } from 'express'
export function createToken(mode: string): (req: Request, res: Response, next: NextFunction) => void;
export function verifyToken(req: Request, res: Response, next: NextFunction): void;
export function verifyAdmin(req: Request, res: Response, next: NextFunction): void;
