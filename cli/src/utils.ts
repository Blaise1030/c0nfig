import fs from 'fs-extra';
import path from 'path';

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
export const readConfig = async (configPath: string = './setup.json'): Promise<any> => {
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
export const replaceAliasWithPath = async (inputStr: string, configPath: string = './setup.json'): Promise<string> => {
    try {
        const config = await readConfig(configPath)
        const aliasPath = config.aliases?.path;

        if (!aliasPath) return inputStr

        const resultStr = inputStr.replace(/~\//g, aliasPath.endsWith('/') ? aliasPath : `${aliasPath}/`);
        return resultStr.replace("*", '');
    } catch (error) {
        console.error(`Error reading config or replacing alias: ${error.message}`);
        throw error;
    }
};


export const getModuleAbsolutePath = async (module: string) => {
    const config = await readConfig()
    const src = config?.aliases?.aliasSource.replace("*", '')
    return `${src}${module}`
}