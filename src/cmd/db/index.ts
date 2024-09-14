#!/usr/bin/env ts-node
import { intro, text, select, spinner } from '@clack/prompts';
import { supabase } from "./examples/supabase/setup"
import { sqlite } from "./examples/sqlite/setup"
import { readInternalFiles } from '../utils/readInternalFiles';
import { turso } from "./examples/turso/setup"
import { execSync } from 'child_process';
import { DATABASE } from '../utils/constant';
import path from 'path';
import fs from 'fs';
import { mutateProjectFiles } from '../utils/mutateProjectFiles';

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
    if (!dbType) process.exit(1); // Handle no selection

    const database = { supabase, turso, sqlite }[dbType as string]

    // Extract the path alias from the config
    const pathAlias = setupConfig.aliases?.path?.replace("*", '') || '';
    const sourceDirectory = setupConfig.aliases.aliasSource.replace("*", '') || ''

    // Adjust the appName placeholder to use the path alias if available
    const defaultAppName = pathAlias ? `${pathAlias}db` : '@/db';

    const appName = await text({
        message: 'Path to database ?',
        placeholder: defaultAppName,
        validate(value) {
            if (value.length === 0) return `Name cannot be empty.`;
            return ``
        }
    });

    const absolutePath = appName.toString().replaceAll(pathAlias, sourceDirectory)
    const projectDir = path.resolve(process.cwd(), absolutePath as string);

    const s = spinner();
    s.start(`Creating your drizzle config...`);

    try {
        // Create project directory if it doesn't exist
        if (!fs.existsSync(projectDir))
            fs.mkdirSync(projectDir, { recursive: true });

        // Write or overwrite index.ts
        const indexFile = readInternalFiles(__dirname, database.init)
        const dbFilePath = path.join(projectDir, 'index.ts');
        fs.writeFileSync(dbFilePath, indexFile, { flag: 'w' });

        // Write or overwrite schema.ts
        const schemaFile = readInternalFiles(__dirname, database.schema)
        const schemaFilePath = path.join(projectDir, 'schema.ts');
        fs.writeFileSync(schemaFilePath, schemaFile, { flag: 'w' });

        // Write or overwrite drizzle.config.ts
        const drizzleKit = readInternalFiles(__dirname, database.drizzleKit)
        const drizzleConfigPath = path.resolve(process.cwd(), 'drizzle.config.ts');
        fs.writeFileSync(drizzleConfigPath, drizzleKit?.replaceAll('${databasePath}', absolutePath), { flag: 'w' });

        // Add drizzle command in package.json
        mutateProjectFiles('package.json', (rawContent: string) => {
            const packageJSONContent = JSON.parse(rawContent);
            packageJSONContent['scripts']['db:generate'] = "drizzle-kit generate"
            packageJSONContent['scripts']['db:migrate'] = "drizzle-kit migrate"
            packageJSONContent['scripts']['db:push'] = "drizzle-kit push"
            return JSON.stringify(packageJSONContent, null, 2)
        })

        mutateProjectFiles('setup.json', (rawContent: string) => {
            const setupJSON = JSON.parse(rawContent);
            setupJSON['db'] = {}
            setupJSON['db']['type'] = dbType?.toString();
            setupJSON['db']['path'] = appName
            return JSON.stringify(setupJSON, null, 2)
        })

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
