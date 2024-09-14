import fs from 'fs'
import path from 'path';

export function readInternalFiles(fPath: string) {
  const filePath = path.resolve(__dirname, fPath)
  return fs.readFileSync(filePath, 'utf-8')
}