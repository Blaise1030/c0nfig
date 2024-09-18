#!/usr/bin/env ts-node
import { intro, text, spinner, select } from '@clack/prompts';
import path from 'path';
import fs from 'fs';
import { mutateProjectFiles } from './utils';

const config = {
    "aliases": {
        "path": "~/*",
        "aliasSource": './src/*'
    }
}


export const cmdInit = async () => {
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

    const packageManager = await select({
        message: 'Choose your package manager?',
        options: [
            { value: 'npm', label: 'npm' },
            { value: 'pnpm', label: 'pnpm' },
            { value: 'yarn', label: 'yarn' },
            { value: 'bun', label: 'bun' }
        ],
    });

    const s = spinner();
    s.start(`Setting up your config...`);

    try {
        // Setup package json
        mutateProjectFiles('package.json', (rawContent: string) => {
            const packageJSONContent = JSON.parse(rawContent);
            packageJSONContent['imports'] = {}
            packageJSONContent['imports'][alias.toString()] = aliasTo.toString()
            return JSON.stringify(packageJSONContent, null, 2)
        })

        mutateProjectFiles('tsconfig.json', (rawContent: string) => {
            const tsConfigContent = JSON.parse(rawContent);
            tsConfigContent['compilerOptions']['paths'] = tsConfigContent['compilerOptions']['paths'] ?? {}
            tsConfigContent['compilerOptions']['paths'][alias.toString()] = [aliasTo.toString()]
            return JSON.stringify(tsConfigContent, null, 2)
        })

        // Setup config json
        config.aliases.path = alias.toString()
        config.aliases.aliasSource = aliasTo.toString()
        config['packageManager'] = packageManager.toString()

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
