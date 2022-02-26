import type { Request, Response, NextFunction } from 'express'
export function generateID(name: string): (req: Request, res: Response, next: NextFunction) => void
export function createFileArray(req: Request, res: Response, next: NextFunction): void
export function checkForFiles(req: Request, res: Response, next: NextFunction): void
