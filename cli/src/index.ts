#!/usr/bin/env node

import { AddExportOperation, AddOperation, Config, InputOperation, InstallOperation, ReadJSONOperation, SelectOperation, UpdateJSONOperation } from "./type";
import { getModuleAbsolutePath, readConfig, replaceAliasWithPath, replaceVariables } from "./utils";
import { execSync } from "child_process";
import yoctoSpinner from "yocto-spinner"
import { Command } from 'commander';
import inquirer from "inquirer";
import fs from 'fs-extra';
import path from 'path';
import _ from "lodash"

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://kmdr.vercel.app/' : 'http://localhost:4321/';

const program = new Command();

export async function fetchConfig(path: string) {
    const res = await fetch(`${BASE_URL}/cli${path}`)
    const content = await res.json()
    return content
}

export async function fetchRemoteFile(path: string) {
    const res = await fetch(`${BASE_URL}${path}`)
    const content = await res.text()
    return content
}

export async function onInputOperation(operation: InputOperation, variables: { [x: string]: string }) {
    const { actions, defaultValue, title, value } = operation;
    const { userInput } = await inquirer.prompt<{ userInput: string }>([{ type: 'input', name: 'userInput', message: title, default: defaultValue }]);
    variables[value] = userInput
    await runOperations(actions, variables)
}

async function onSelectOperation(operation: SelectOperation, variables: Record<string, string>): Promise<void> {
    try {
        const { selectedValue } = await inquirer.prompt<{ selectedValue: string }>([{ type: 'list', name: 'selectedValue', message: operation.title, choices: operation.selections.map((selection) => ({ name: selection.label, value: selection.value })) }]);
        variables[operation.value] = selectedValue;
        const operationsToExecute = operation.values[selectedValue];
        await runOperations(operationsToExecute, variables)
    } catch (error) {
        console.error(`Error during select operation: ${error.message}`);
    }
};

export async function onAddOperation(operation: AddOperation, variable: { [x: string]: string }) {
    const { remoteSrc, targetSrc } = operation
    const item = await fetchRemoteFile(replaceVariables(remoteSrc, variable))
    const resolvedTargetPath = path.resolve(targetSrc.startsWith('~') ? await replaceAliasWithPath(targetSrc) : targetSrc);
    await fs.ensureDir(path.dirname(resolvedTargetPath));
    fs.writeFileSync(resolvedTargetPath, replaceVariables(item, variable))

    console.log(`Copied ${remoteSrc} to ${resolvedTargetPath}`);
}

async function onUpdateJSONOperation(operation: UpdateJSONOperation, variables: Record<string, string>) {
    const resolvedFilePath = path.resolve(await replaceAliasWithPath(operation.targetSrc));
    try {
        const jsonContent = await fs.readJSON(resolvedFilePath);
        const replacedValue = replaceVariables(operation.value, variables);
        _.set(jsonContent, operation.path, replacedValue);
        await fs.writeJSON(resolvedFilePath, jsonContent, { spaces: 2 });

        console.log(`Updated ${operation.path} in ${resolvedFilePath} with value: ${replacedValue}`);
    } catch (error) {
        console.error(`Failed to update JSON file: ${error.message}`);
    }
};

async function onInstallOperation(operation: InstallOperation) {
    const config = await readConfig()
    const packageManager = config['packageManager']

    const installCommand = {
        npm: { prod: `npm install`, dev: `npm install --save-dev` },
        yarn: { prod: `yarn add`, dev: `yarn add --dev` },
        pnpm: { prod: `pnpm install`, dev: `pnpm add --save-dev` },
    };

    if (operation.dep && operation.dep.length > 0) {
        const depCommand = `${installCommand[packageManager].prod} ${operation.dep.join(' ')}`;
        const spinner = yoctoSpinner({ text: `Installing dependencies: ${depCommand}` }).start();
        execSync(depCommand);
        spinner.stop();
        console.log('Dependencies installed.');
    }

    if (operation.devDep && operation.devDep.length > 0) {
        const devDepCommand = `${installCommand[packageManager].dev} ${operation.devDep.join(' ')}`;
        const spinner = yoctoSpinner({ text: `Installing dev dependencies: ${devDepCommand}` }).start();
        execSync(devDepCommand);
        spinner.stop()
        console.log('Dev dependencies installed.');
    }
};

/**
 * Handler for the `readJSON` operation.
 * Reads the JSON file, checks the `db.engine` value, and executes corresponding operations.
 */
async function onReadJSONOperation(operation: ReadJSONOperation, variables: Record<string, string>) {
    try {
        const resolvedFilePath = path.resolve(await replaceAliasWithPath(operation.targetSrc));
        const jsonContent = await fs.readJSON(resolvedFilePath);

        // Get the value of `db.engine` from the JSON content
        const readingValue = _.get(jsonContent, operation?.path, null);

        if (!readingValue) {
            console.error(`Value at ${operation?.path} in ${resolvedFilePath} is not found`);
            return;
        }

        if (operation?.value) variables[operation?.value] = readingValue
        const operations = operation?.values[readingValue]

        await runOperations(operations, variables);
    } catch (error) {
        console.error(`Failed to read JSON or execute operations: ${error.message}`);
    }
};


/**
 * Appends content to the end of the file.
 * @param filePath - The path to the file.
 * @param content - The content to append.
 */
const appendToFile = async (operation: AddExportOperation): Promise<void> => {
    try {
        const resolvedPath = path.resolve(await replaceAliasWithPath(operation.targetSrc));
        const existingContent = await fs.readFile(resolvedPath, 'utf8') as string;
        if (existingContent.includes(operation.content)) return
        await fs.appendFile(resolvedPath, `\n${operation.content}`);
        console.log(`Appended content to ${resolvedPath}`);
    } catch (error) {
        console.error(`Error appending to file: ${error.message}`);
    }
};

/**
 * Prepends content to the beginning of the file.
 * @param filePath - The path to the file.
 * @param content - The content to prepend.
 */
const prependToFile = async (operation: AddExportOperation): Promise<void> => {
    try {
        const resolvedPath = path.resolve(await replaceAliasWithPath(operation.targetSrc));
        const existingContent = await fs.readFile(resolvedPath, 'utf8') as string;
        if (existingContent.includes(operation.content)) return
        const updatedContent = `${operation?.content}\n${existingContent}`;
        await fs.writeFile(resolvedPath, updatedContent, 'utf8');
        console.log(`Prepended content to ${resolvedPath}`);
    } catch (error) {
        console.error(`Error prepending to file: ${error.message}`);
    }
};


async function runOperations(operation: Config, variables: { [x: string]: string }) {
    for (let i = 0; i < operation.length; i++) {
        const { op } = operation[i];
        switch (op) {
            case 'add':
                await onAddOperation(operation[i] as AddOperation, variables)
                break;
            case 'add-export':
                const appendOp = operation[i] as AddExportOperation
                await appendToFile(appendOp)
                break;
            case 'add-import':
                const prependOp = operation[i] as AddExportOperation
                await prependToFile(prependOp)
                break;
            case 'install':
                await onInstallOperation(operation[i] as InstallOperation)
                break;
            case 'select':
                await onSelectOperation(operation[i] as SelectOperation, variables)
                break;
            case 'readJSON':
                await onReadJSONOperation(operation[i] as ReadJSONOperation, variables)
                break;
            case 'updateJSON':
                await onUpdateJSONOperation(operation[i] as UpdateJSONOperation, variables)
                break;
            case 'input':
                await onInputOperation(operation[i] as InputOperation, variables)
                break;
            default:
                console.log(`Unsupported operation: ${op}`);
        }
    }
}

program
    .command('init')
    .description('Initialize the project configuration')
    .action(async () => {
        const res = await fetchConfig('/init.json')
        await runOperations(res, {})
    })

program.command('db init')
    .description('Initialize the project database')
    .action(async () => {
        const res = await fetchConfig('/db.json')
        await runOperations(res, {})
    })

program.command('auth')
    .argument('<operation>', 'init, add')
    .argument('[authMethod...]', 'google, discord, github, password')
    .description('Initialize the auth module')
    .action(async (operation, authMethod) => {
        const defaultVariables = { "$absDbPath": await getModuleAbsolutePath('db') }
        if (operation === 'init') {
            const res = await fetchConfig('/auth.json')
            await runOperations(res, defaultVariables)
        } else if (operation === 'add') {
            const res = await fetchConfig('/auth-add.json')
            for (let i = 0; i < authMethod.length; i++) {
                const method = authMethod[i]
                const item = res[method]
                await runOperations(item, defaultVariables)
            }
        }
    })

program.parse(process.argv);