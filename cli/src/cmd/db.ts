#!/usr/bin/env ts-node
import { mutateProjectFiles, fetchConfig, fetchFilesAsString, getSetupConfig, type TDBConfigStruct, DATABASE, getModuleAbsolutePath, generateInstallSignature } from './utils';
import { intro, text, select, spinner } from '@clack/prompts';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';


export const drizzle_init = async () => {
    intro('⚡️ Drizzle & Drizzle Kit initializer');

    getSetupConfig();

    const appName = await text({
        message: 'Enter the folder name for database',
        placeholder: 'db',
        validate(value) {
            if (value.length === 0) return `Name cannot be empty.`;
            return ``
        }
    });

    const dbType = await select({
        message: 'Select your database type',
        options: [
            { value: DATABASE.sqlite, label: 'Local (SQLite)' },
            { value: DATABASE.turso, label: 'Turso (SQLite)' },
            { value: DATABASE.supabase, label: 'Supabase (PostgresQL)' },
        ],
    });

    mutateProjectFiles('setup.json', (rawContent: string) => {
        const setupJSON = JSON.parse(rawContent);
        setupJSON['db'] = {}
        setupJSON['db']['type'] = dbType?.toString();
        setupJSON['db']['name'] = appName
        return JSON.stringify(setupJSON, null, 2)
    })

    // Save the selected database type to setup.json
    if (!dbType) process.exit(1); // Handle no selection

    const config = await fetchConfig()
    const { dependencies, devDependencies, init, drizzleKit, schema } = config['db'][dbType as string] as TDBConfigStruct

    const initContent = await fetchFilesAsString(init)
    const drizzleKitContent = await fetchFilesAsString(drizzleKit)
    const schemaContent = await fetchFilesAsString(schema)

    const projectDir = getModuleAbsolutePath('db')

    const s = spinner();
    s.start(`Creating your drizzle config...`);

    try {
        // Create project directory if it doesn't exist
        if (!fs.existsSync(projectDir))
            fs.mkdirSync(projectDir, { recursive: true });

        // Write or overwrite index.ts
        const dbFilePath = path.join(projectDir, 'index.ts');
        fs.writeFileSync(dbFilePath, initContent, { flag: 'w' });

        // Write or overwrite schema.ts
        const schemaFilePath = path.join(projectDir, 'schema.ts');
        fs.writeFileSync(schemaFilePath, schemaContent, { flag: 'w' });

        // Write or overwrite drizzle.config.ts        
        const drizzleConfigPath = path.resolve(process.cwd(), 'drizzle.config.ts');
        fs.writeFileSync(drizzleConfigPath, drizzleKitContent?.replaceAll('${databasePath}', projectDir), { flag: 'w' });

        // Add drizzle command in package.json
        mutateProjectFiles('package.json', (rawContent: string) => {
            const packageJSONContent = JSON.parse(rawContent);
            packageJSONContent['scripts']['db:generate'] = "drizzle-kit generate"
            packageJSONContent['scripts']['db:migrate'] = "drizzle-kit migrate"
            packageJSONContent['scripts']['db:push'] = "drizzle-kit push"
            return JSON.stringify(packageJSONContent, null, 2)
        })

        s.message('Installing dependencies...')

        // Install dependencies
        execSync(
            `${generateInstallSignature()} ${dependencies?.join(' ')}`,
            { cwd: projectDir, stdio: 'inherit' }
        );

        s.message('Installing dev dependencies...')

        execSync(
            `${generateInstallSignature(true)} ${devDependencies?.join(' ')}`,
            { cwd: projectDir, stdio: 'inherit' }
        );

        s.stop('Drizzle has been setup! 🎉');
    } catch (err) {
        s.stop('Error occurred while setting up the project.');
        console.error(err);
    }
};

