#!/usr/bin/env ts-node
import { intro, text, spinner } from '@clack/prompts';
import path from 'path';
import fs from 'fs';

const config = {
    "aliases": {
        "path": "~/*"
    }
}

export const cmd_init = async () => {
    intro('⚡️ Cmd initialiser');

    const alias = await text({
        message: 'Which alias would you like to use ?',
        placeholder: '~/*',
        validate(value) {
            if (value.length === 0) return `Config name cannot be empty.`;
            return ``
        }
    });

    config.aliases.path = alias.toString()

    const s = spinner();
    s.start(`Setting up your config...`);

    try {
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
