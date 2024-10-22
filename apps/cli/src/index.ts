#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();
import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import yoctoSpinner from 'yocto-spinner';
import _ from 'lodash';
import {
    type AddExportOperation,
    type AddImportOperation,
    type AddOperation,
    type ConditionalOperation,
    type Config,
    type InputOperation,
    type InstallOperation,
    OperationConfig,
    OperationConfigSchema,
    type ReadJSONOperation,
    type SelectOperation,
    type UpdateJSONOperation,
} from '@k0nfig/types';
import {
    evaluate,
    printValidationErrors,
    readConfig,
    replaceAliasWithPath,
    replaceVariables,
} from './utils';
const execAsync = promisify(exec);
const program = new Command();

let BASE_URL = process.env.BASE_URL ?? 'https://c0nfig.vercel.app';
const INIT_URL = `${BASE_URL}/cli/init.json`
export const COMMAND_CONFIG_FILENAME = 'command.config.json'

program
    .version('0.0.1')
    .description('k0nfig - A flexible CLI tool for executing remote configurations')
    .command('run <remote-config-url>')
    .description('Fetch and execute remote configuration')
    .action(async (remoteURL: string) => {
        try {
            const setupFilePath = path.resolve(COMMAND_CONFIG_FILENAME);
            if (!(await fs.pathExists(setupFilePath))) {
                console.error(`Error: ${COMMAND_CONFIG_FILENAME} not found. Please run "npx k0nfig @latest init" first.`);
                process.exit(1);
            }

            const url = new URL(remoteURL);

            if (url.protocol !== 'https:') {
                console.error('Only HTTPS protocol is allowed for remote configurations.');
                process.exit(1);
            }

            BASE_URL = url.origin;
            const config = await fetchConfig(url.pathname);
            await runOperations(config.operation, {});
        } catch (error) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    });

program
    .command('init')
    .description('Initialises kmdr CLI tool')
    .action(async () => {
        try {
            const url = new URL(INIT_URL);
            BASE_URL = url.origin;
            const config = await fetchConfig(url.pathname);
            await runOperations(config.operation, {});
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    });

program
    .command('verify <remote-config-url>')
    .description('Verify if remote configuration matches schema')
    .action(async (remoteURL: string) => {
        try {
            const url = new URL(remoteURL);

            if (url.protocol !== 'https:' && url.protocol !== 'http:') {
                console.error('Only HTTP and HTTPS protocols are allowed for remote configurations.');
                process.exit(1);
            }

            BASE_URL = url.origin;
            const config = await fetchConfig(url.pathname);

            // Validate the config
            const validation = OperationConfigSchema.safeParse(config);
            if (validation.success) {
                console.log('Validation succeeded: The configuration matches the schema.');
            } else {
                console.error('Validation failed:');
                printValidationErrors(validation.error);
                process.exit(1);
            }
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
        }
    });


program.parse(process.argv);

/**
 * Fetches the remote configuration file.
 * @param path - The path to the configuration file.
 * @returns The parsed configuration object.
 */
async function fetchConfig(configPath: string): Promise<OperationConfig> {
    const url = `${BASE_URL}${configPath}`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch configuration from ${url}: ${response.statusText}`);
        }

        const content: OperationConfig = await response.json();
        return content;
    } catch (error) {
        throw new Error(`Error fetching configuration: ${error.message}`);
    }
}

/**
 * Fetches a remote file's content as text.
 * @param filePath - The path to the remote file.
 * @returns The content of the file.
 */
async function fetchRemoteFile(filePath: string): Promise<string> {
    const url = `${BASE_URL}${filePath}`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch file from ${url}: ${response.statusText}`);
        }

        const content = await response.text();
        return content;
    } catch (error) {
        throw new Error(`Error fetching remote file: ${error.message}`);
    }
}

async function onInputOperation(
    operation: InputOperation,
    variables: Record<string, string>
): Promise<void> {
    const { actions, defaultValue, title, value } = operation;

    const { userInput } = await inquirer.prompt<{ userInput: string }>([
        {
            type: 'input',
            name: 'userInput',
            message: title,
            default: defaultValue,
        },
    ]);

    variables[value] = userInput;
    await runOperations(actions, variables);
}

async function onSelectOperation(
    operation: SelectOperation,
    variables: Record<string, string>
): Promise<void> {
    const { selections, title, value, values } = operation;

    try {
        const { selectedValue } = await inquirer.prompt<{ selectedValue: string }>([
            {
                type: 'list',
                name: 'selectedValue',
                message: title,
                choices: selections.map((selection) => ({
                    name: selection.label,
                    value: selection.value,
                })),
            },
        ]);

        variables[value] = selectedValue;
        const operationsToExecute = values[selectedValue];
        await runOperations(operationsToExecute, variables);
    } catch (error) {
        console.error(`Error during select operation: ${error.message}`);
    }
}

async function onAddOperation(
    operation: AddOperation,
    variables: Record<string, string>
): Promise<void> {
    const { remoteSrc, targetSrc } = operation;

    try {
        const content = await fetchRemoteFile(replaceVariables(remoteSrc, variables));
        const resolvedTargetPath = path.resolve(replaceVariables(await replaceAliasWithPath(targetSrc), variables));

        await fs.ensureDir(path.dirname(resolvedTargetPath));

        if (await fs.pathExists(resolvedTargetPath)) {
            const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>({
                type: 'confirm',
                name: 'overwrite',
                message: `File ${resolvedTargetPath} already exists. Overwrite?`,
                default: false,
            });

            if (!overwrite) {
                console.log(`Skipped writing to ${resolvedTargetPath}`);
                return;
            }
        }

        await fs.writeFile(resolvedTargetPath, replaceVariables(content, variables));
        console.log(`Copied ${remoteSrc} to ${resolvedTargetPath}`);
    } catch (error) {
        console.error(`Failed to add file from ${remoteSrc} to ${targetSrc}: ${error.message}`);
    }
}

async function onUpdateJSONOperation(
    operation: UpdateJSONOperation,
    variables: Record<string, string>
): Promise<void> {
    const resolvedFilePath = path.resolve(replaceVariables(await replaceAliasWithPath(operation.targetSrc), variables));

    try {
        const jsonContent = await fs.readJSON(resolvedFilePath);
        const replacedValue = replaceVariables(operation.value, variables);
        _.set(jsonContent, replaceVariables(operation.path, variables), replacedValue);
        await fs.writeJSON(resolvedFilePath, jsonContent, { spaces: 2 });

        console.log(`Updated ${operation.path} in ${resolvedFilePath} with value: ${replacedValue}`);
    } catch (error) {
        console.error(`Failed to update JSON file at ${resolvedFilePath}: ${error.message}`);
    }
}

async function onInstallOperation(operation: InstallOperation): Promise<void> {
    try {
        const config = await readConfig();
        const packageManager = config['packageManager'] || detectPackageManager();

        const installCommands = {
            npm: { prod: 'npm install', dev: 'npm install --save-dev' },
            yarn: { prod: 'yarn add', dev: 'yarn add --dev' },
            pnpm: { prod: 'pnpm add', dev: 'pnpm add --save-dev' },
        };

        const commands = installCommands[packageManager];

        if (operation.dep && operation.dep.length > 0) {
            const depCommand = `${commands.prod} ${operation.dep.join(' ')}`;
            const spinner = yoctoSpinner({ text: `Installing dependencies: ${depCommand}` }).start();
            await execAsync(depCommand);
            spinner.stop();
            console.log('Dependencies installed.');
        }

        if (operation.devDep && operation.devDep.length > 0) {
            const devDepCommand = `${commands.dev} ${operation.devDep.join(' ')}`;
            const spinner = yoctoSpinner({ text: `Installing dev dependencies: ${devDepCommand}` }).start();
            await execAsync(devDepCommand);
            spinner.stop();
            console.log('Dev dependencies installed.');
        }
    } catch (error) {
        console.error(`Failed to install dependencies: ${error.message}`);
    }
}

/**
 * Handler for the `readJSON` operation.
 * Reads the JSON file, retrieves a value, and executes corresponding operations.
 */
async function onReadJSONOperation(
    operation: ReadJSONOperation,
    variables: Record<string, string>
): Promise<void> {
    try {
        const resolvedFilePath = path.resolve(replaceVariables(await replaceAliasWithPath(operation.targetSrc), variables));
        const jsonContent = await fs.readJSON(resolvedFilePath);

        const readingValue = _.get(jsonContent, replaceVariables(operation.path, variables), null);

        if (!readingValue) {
            console.error(`Value at ${operation.path} in ${resolvedFilePath} is not found.`);
            return;
        }

        if (operation.value) {
            variables[operation.value] = readingValue;
        }

        const operations = operation.values[readingValue];

        if (operations) {
            await runOperations(operations, variables);
        } else {
            console.warn(`No operations defined for value "${readingValue}" in readJSON operation.`);
        }
    } catch (error) {
        console.error(`Failed to read JSON or execute operations: ${error.message}`);
    }
}

/**
 * Appends content to the end of the file if it doesn't already exist.
 */

async function addImportStatement(
    operation: AddImportOperation,
    variables: Record<string, string>
): Promise<void> {
    try {
        const resolvedPath = path.resolve(replaceVariables(await replaceAliasWithPath(operation.targetSrc), variables));
        let fileContent = await fs.readFile(resolvedPath, 'utf8');

        // Replace variables in the content
        const contentToAdd = replaceVariables(operation.content, variables).trim();

        // Check if the import already exists
        if (fileContent.includes(contentToAdd)) {
            console.log('Import statement already exists. Skipping.');
            return;
        }

        // Split the file into lines
        const lines = fileContent.split(/\r?\n/);

        // Find the last import statement
        let lastImportIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (/^\s*import\s.+from\s.+;?\s*$/.test(lines[i])) {
                lastImportIndex = i;
            }
        }

        // Insert the new import statement
        if (lastImportIndex >= 0) {
            lines.splice(lastImportIndex + 1, 0, contentToAdd);
        } else {
            // No existing imports, add at the top
            lines.unshift(contentToAdd);
        }

        // Join the lines back into a string
        const updatedContent = lines.join('\n');

        await fs.writeFile(resolvedPath, updatedContent, 'utf8');
        console.log(`Added import to ${resolvedPath}`);
    } catch (error) {
        console.error(`Error adding import statement: ${error.message}`);
    }
}
/**
 * Prepends content to the beginning of the file if it doesn't already exist.
 */
async function addExportStatement(
    operation: AddExportOperation,
    variables: Record<string, string>
): Promise<void> {
    try {
        const resolvedPath = path.resolve(replaceVariables(await replaceAliasWithPath(operation.targetSrc), variables));
        let fileContent = await fs.readFile(resolvedPath, 'utf8');

        // Replace variables in the content
        const contentToAdd = replaceVariables(operation.content, variables).trim();

        // Check if the export already exists
        if (fileContent.includes(contentToAdd)) {
            console.log('Export statement already exists. Skipping.');
            return;
        }

        // Ensure the file ends with a newline
        if (!fileContent.endsWith('\n')) {
            fileContent += '\n';
        }

        // Append the export statement
        fileContent += contentToAdd + '\n';

        await fs.writeFile(resolvedPath, fileContent, 'utf8');
        console.log(`Added export to ${resolvedPath}`);
    } catch (error) {
        console.error(`Error adding export statement: ${error.message}`);
    }
}


async function onConditionalOperation(
    operation: ConditionalOperation,
    variables: Record<string, string>
): Promise<void> {
    const conditionStr = replaceVariables(operation.condition, variables);

    let conditionResult: boolean;

    try {
        // Use a safe evaluator instead of eval
        conditionResult = evaluate(conditionStr, variables);
    } catch (error) {
        console.error(`Failed to evaluate condition "${conditionStr}": ${error.message}`);
        return;
    }

    if (conditionResult) {
        await runOperations(operation.then, variables);
    } else if (operation.else) {
        await runOperations(operation.else, variables);
    }
}

async function runOperations(operations: Config, variables: Record<string, string>): Promise<void> {
    for (const operation of operations) {
        const { op } = operation;

        switch (op) {
            case 'add':
                await onAddOperation(operation as AddOperation, variables);
                break;
            case 'add-export':
                await addExportStatement(operation as AddExportOperation, variables);
                break;
            case 'add-import':
                await addImportStatement(operation as AddImportOperation, variables);
                break;
            case 'install':
                await onInstallOperation(operation as InstallOperation);
                break;
            case 'select':
                await onSelectOperation(operation as SelectOperation, variables);
                break;
            case 'readJSON':
                await onReadJSONOperation(operation as ReadJSONOperation, variables);
                break;
            case 'updateJSON':
                await onUpdateJSONOperation(operation as UpdateJSONOperation, variables);
                break;
            case 'input':
                await onInputOperation(operation as InputOperation, variables);
                break;
            case 'conditional':
                await onConditionalOperation(operation as ConditionalOperation, variables);
                break;
            default:
                console.warn(`Unsupported operation: ${op}`);
        }
    }
}

/**
 * Detects the package manager used in the project.
 */
function detectPackageManager(): 'npm' | 'yarn' | 'pnpm' {
    if (fs.existsSync('yarn.lock')) {
        return 'yarn';
    }
    if (fs.existsSync('pnpm-lock.yaml')) {
        return 'pnpm';
    }
    return 'npm';
}

/**
 * Gracefully handles process termination.
 */
process.on('SIGINT', () => {
    console.log('Process interrupted. Exiting gracefully...');
    process.exit(0);
});