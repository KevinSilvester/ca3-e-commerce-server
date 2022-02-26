import { PathLike } from "fs";
export = moveFile;
declare function moveFile(file: PathLike, source: string, destination: string): Promise<void>;
import fs = require("fs");
