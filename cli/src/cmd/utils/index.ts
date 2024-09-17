import { BASE_URL } from "./constant"
import path from "path";
import fs from "fs";

export function getModuleAbsolutePath(moduleName: string) {
    const currentFileContent = getSetupConfig()
    const currentModulePath = currentFileContent[moduleName]['name']

    const { aliasSource } = currentFileContent['aliases']
    const removedStartAliasSource = aliasSource.replaceAll("*", '')

    return `${removedStartAliasSource}${currentModulePath}`
}

export function getModuleAliasPath(moduleName: string) {
    const setupConfig = getSetupConfig()
    const sourceAlias = setupConfig['aliases']['path'].replaceAll("*", '')
    const moduleFolder = setupConfig[moduleName]['name']
    return `${sourceAlias}${moduleFolder}`
}

export async function fetchFilesAsString(path: string) {
    const res = await fetch(`${BASE_URL}/assets${path}`)
    const content = await res.text()
    return content
}

export function mutateProjectFiles(filePath: string, readCallback: (input: string) => string) {
    const currentFilePath = path.join(process.cwd(), filePath)
    const currentFileContent = fs.readFileSync(currentFilePath, 'utf-8');
    const mutateOutput = readCallback(currentFileContent)
    fs.writeFileSync(currentFilePath, mutateOutput, { flag: 'w' });
}

export async function fetchConfig() {
    const res = await fetch(`${BASE_URL}/assets/config.json`)
    const config = await res.json()
    return config;
}

export function getSetupConfig() {
    const setupPath = path.join(process.cwd(), 'setup.json');

    if (!fs.existsSync(setupPath)) {
        console.error('setup.json not found. Please run the init command first.');
        process.exit(1);
    }

    return JSON.parse(fs.readFileSync(setupPath, 'utf-8'));
}


export function generateInstallSignature(isDev: boolean = false) {
    const { packageManager } = getSetupConfig()
    return `${{
        'npm': 'npm i',
        'pnpm': 'pnpm add',
        'yarn': 'yarn add',
        'bun': 'bun add'
    }[packageManager]} ${isDev ? '-D' : ''}`
}

export * from "./constant"
export * from "./types"
