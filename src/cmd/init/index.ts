#!/usr/bin/env ts-node
import { intro, text, spinner } from '@clack/prompts';
import path from 'path';
import fs from 'fs';

const config = {
    "aliases": {
        "path": "~/*",
        "aliasSource": './src/*'
    }
}

export const cmd_init = async () => {
    intro('⚡️ Cmd initialiser');

    const aliasTo = await text({
        message: 'Where is your source directory ?',
        placeholder: './src/*',
        validate(value) {
            if (value.length === 0) return `Source directory cannot be empty.`;
            return ``
        }
    });

    const alias = await text({
        message: 'Which alias would you like to use to the source directory ?',
        placeholder: '~/*',
        validate(value) {
            if (value.length === 0) return `Alias cannot be empty.`;
            return ``
        }
    });

    const s = spinner();
    s.start(`Setting up your config...`);

    try {
        // Setup package json
        const packageJSONPath = path.join(process.cwd(), 'package.json')
        const packageJSONContent = JSON.parse(fs.readFileSync(packageJSONPath, 'utf-8'));

        packageJSONContent['imports'] = {}
        packageJSONContent['imports'][alias.toString()] = aliasTo.toString()

        fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSONContent, null, 2), { flag: 'w' });

        // Setup tsconfig
        const tsConfigPath = path.join(process.cwd(), 'tsconfig.json')
        const tsConfigContent = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8'));

        tsConfigContent['compilerOptions']['paths'] = {}
        tsConfigContent['compilerOptions']['paths'][alias.toString()] = [aliasTo.toString()]

        fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfigContent, null, 2), { flag: 'w' });

        // Setup config json
        config.aliases.path = alias.toString()
        config.aliases.aliasSource = aliasTo.toString()

        const projectDir = path.resolve(process.cwd(), '');
        // Create project directory if it doesn't exist
        const setupPath = path.join(projectDir, 'setup.json');
        fs.writeFileSync(setupPath, JSON.stringify(config, null, 2), { flag: 'w' });

        s.stop('Cmd has been setup! 🎉');
    } catch (err) {
        s.stop('Error occurred while setting up the project.');
        console.error(err);
    }
};
