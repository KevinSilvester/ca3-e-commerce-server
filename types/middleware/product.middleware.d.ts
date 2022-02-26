import { Request, Response , NextFunction } from 'express'
export function validateProductBody(req: Request, res: Response, next: NextFunction): Promise<void>;
