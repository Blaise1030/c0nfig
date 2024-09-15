import fs from 'fs'
import path from 'path';

export function readInternalFiles(folderPath, fPath: string) {
  const filePath = path.resolve(folderPath, fPath)
  return fs.readFileSync(filePath, 'utf-8')
}