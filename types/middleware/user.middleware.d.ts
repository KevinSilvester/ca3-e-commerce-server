import type { AnyZodObject } from 'zod'
import type { Request, Response, NextFunction } from 'express'
export function checkForDuplicates(req: Request, res: Response, next: NextFunction): Promise<void>
export function checkUserExists(req: Request, res: Response, next: NextFunction): Promise<void>
export function validateRequestBody<T extends AnyZodObject>(
   schema: T
): (req: Request, res: Response, next: NextFunction) => Promise<void>
export function checkIfBodyEmpty(req: Request, res: Response, next: NextFunction): void
export function createPipeline(req: Request, res: Response, next: NextFunction): void
