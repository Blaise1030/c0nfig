#!/usr/bin/env ts-node
import { intro, text, select, spinner } from '@clack/prompts';
import { execSync } from 'child_process';
import { supabase } from "./supabase"
import { sqlite } from "./sqlite"
import { turso } from "./turso"
import path from 'path';
import fs from 'fs';
import { DATABASE } from '../constant';

export const drizzle_init = async () => {
    intro('⚡️ Drizzle & Drizzle Kit initializer');

    const setupPath = path.join(process.cwd(), 'setup.json');

    if (!fs.existsSync(setupPath)) {
        console.error('setup.json not found. Please run the init command first.');
        process.exit(1);
    }

    // Read the setup.json file
    const setupConfig = JSON.parse(fs.readFileSync(setupPath, 'utf-8'));

    const dbType = await select({
        message: 'Select your database type',
        options: [
            { value: DATABASE.sqlite, label: 'Local (SQLite)' },
            { value: DATABASE.turso, label: 'Turso (SQLite)' },
            { value: DATABASE.supabase, label: 'Supabase (PostgresQL)' },
        ],
    });

    // Save the selected database type to setup.json
    setupConfig['dbType'] = dbType?.toString();
    console.log(setupConfig)
    fs.writeFileSync(setupPath, JSON.stringify(setupConfig, null, 2), 'utf-8');

    if (!dbType) process.exit(1); // Handle no selection

    const database = { supabase, turso, sqlite }[dbType as string]

    // Extract the path alias from the config
    const pathAlias = setupConfig.aliases?.path?.replace("*", '') || '';

    // Adjust the appName placeholder to use the path alias if available
    const defaultAppName = pathAlias ? `${pathAlias}db` : '@/db';

    const appName = await text({
        message: 'Where do you want to store your database ?',
        placeholder: defaultAppName,
        validate(value) {
            if (value.length === 0) return `Name cannot be empty.`;
            return ``
        }
    });

    const projectDir = path.resolve(process.cwd(), appName.toString().replaceAll(pathAlias, './src/') as string);

    const s = spinner();
    s.start(`Creating your drizzle config...`);

    try {
        // Create project directory if it doesn't exist
        if (!fs.existsSync(projectDir))
            fs.mkdirSync(projectDir, { recursive: true });

        // Write or overwrite db.ts
        const dbFilePath = path.join(projectDir, 'index.ts');
        fs.writeFileSync(dbFilePath, database?.init, { flag: 'w' });

        // Write or overwrite schema.ts
        const schemaFilePath = path.join(projectDir, 'schema.ts');
        fs.writeFileSync(schemaFilePath, database?.schema, { flag: 'w' });

        // Write or overwrite drizzle.config.ts
        const drizzleConfigPath = path.resolve(process.cwd(), 'drizzle.config.ts');
        fs.writeFileSync(drizzleConfigPath, database?.drizzleKit(appName?.toString()), { flag: 'w' });

        s.message('Installing dependencies...')

        // Install dependencies
        execSync(
            `npm install ${database?.dependencies?.join(' ')}`,
            { cwd: projectDir, stdio: 'inherit' }
        );

        execSync(
            `npm install -D ${database?.devDependencies?.join(' ')}`,
            { cwd: projectDir, stdio: 'inherit' }
        );

        s.stop('Drizzle has been setup! 🎉');
    } catch (err) {
        s.stop('Error occurred while setting up the project.');
        console.error(err);
    }
};
