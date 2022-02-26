import { PathLike } from 'fs'
export = deleteFiles;
declare function deleteFiles(fileArray: PathLike[]): Promise<void>;
