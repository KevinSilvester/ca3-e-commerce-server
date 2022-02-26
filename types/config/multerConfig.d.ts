import type { Request } from 'express'
import type { StorageEngine, FileFilterCallback } from 'multer'
export function getFileName(req: Request, file: Express.Multer.File): string
export function multerConfig(subDirName: string): {
   fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => void
   storage: StorageEngine
}
