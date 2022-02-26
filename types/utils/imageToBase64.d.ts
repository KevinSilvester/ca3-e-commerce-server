import { PathLike } from 'fs'
export = imageToBase64
declare function imageToBase64(imagePath: PathLike): Promise<string>
