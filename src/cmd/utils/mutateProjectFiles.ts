import path from "path";
import fs from "fs";

export function mutateProjectFiles(filePath: string, readCallback: (input: string) => string) {
  const currentFilePath = path.join(process.cwd(), filePath)
  const currentFileContent = fs.readFileSync(currentFilePath, 'utf-8');
  const mutateOutput = readCallback(currentFileContent)
  fs.writeFileSync(currentFilePath, mutateOutput, { flag: 'w' });
}