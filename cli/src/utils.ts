import { Parser } from 'expr-eval';
import fs from 'fs-extra';
import path from 'path';
import { COMMAND_CONFIG_FILENAME } from './index';
import { z } from 'zod';

/**
 * Replaces variables in a string (denoted by $) with corresponding values from an object where keys are prefixed with $.
 * @param str - The string containing variables prefixed with $ (e.g., "hello/$database").
 * @param variables - An object containing the variables with $ as keys (e.g., { $database: "PostgresDB" }).
 * @returns - The string with the variables replaced by their corresponding values.
 */
export function replaceVariables(str: string, variables: Record<string, string>): string {
    return str.replaceAll(/\$([a-zA-Z_][\w]*)/g, (_, variable) => {
        // Look up the variable in the object with a prefixed $ and replace it if found
        const key = `$${variable}`;
        return variables[key] || key;
    });
}

/**
 * Reads the config file (config.json) and returns its contents.
 * @param configPath - The path to the config file. Defaults to './setup.json'.
 * @returns The contents of the config file as an object.
 */
export const readConfig = async (configPath: string = COMMAND_CONFIG_FILENAME): Promise<any> => {
    try {
        const resolvedConfigPath = path.resolve(configPath);
        const config = await fs.readJSON(resolvedConfigPath);
        return config;
    } catch (error) {
        console.error(`Error reading config file at ${configPath}: ${error.message}`);
        throw new Error('Failed to read the config file. Have your run the init command ?');
    }
};

/**
 * Reads the `path` value from the `config.json` file and replaces the `~` alias in a given string with the actual path.
 * @param inputStr - The string that contains the `~` alias to be replaced.
 * @param configPath - The path to the `config.json` file (default is './config.json').
 * @returns - The string with the `~` alias replaced with the actual path from the config file.
 */
export const replaceAliasWithPath = async (inputStr: string, configPath: string = COMMAND_CONFIG_FILENAME): Promise<string> => {
    try {
        const config = await readConfig(configPath)
        const aliasPath = config.aliases?.path;

        if (!aliasPath) return inputStr

        const resultStr = inputStr.replace(/~\//g, aliasPath.endsWith('/') ? aliasPath : `${aliasPath}/`);
        return resultStr.replace("*", '');
    } catch (error) {
        console.error(`${COMMAND_CONFIG_FILENAME} file not found`);
        return inputStr
    }
};


export const getModuleAbsolutePath = async (module: string) => {
    const config = await readConfig()
    const src = config?.aliases?.aliasSource.replace("*", '')
    return `${src}${module}`
}

export function evaluate(expression: string, variables: Record<string, any>): boolean {
    try {
        const parser = new Parser();
        const expr = parser.parse(expression);
        const result = expr.evaluate(variables);
        return Boolean(result);
    } catch (error) {
        throw new Error(`Failed to evaluate expression: ${error.message}`);
    }
}

export function printValidationErrors(error: z.ZodError) {
    error.errors.forEach((err) => {
        const path = err.path.length > 0 ? `Path: ${err.path.join(' -> ')}` : 'At root';
        console.error(`${path}`);
        console.error(`  Issue: ${err.message}`);
        if (err.code === 'invalid_union') {
            console.error('  Expected one of the following schemas:');
            err.unionErrors?.forEach((unionErr, index) => {
                console.error(`  Option ${index + 1}:`);
                unionErr.errors.forEach((ue) => {
                    const unionPath = ue.path.length > 0 ? `Path: ${ue.path.join(' -> ')}` : 'At root';
                    console.error(`    ${unionPath}`);
                    console.error(`      Issue: ${ue.message}`);
                });
            });
        }
        console.error('');
    });
}