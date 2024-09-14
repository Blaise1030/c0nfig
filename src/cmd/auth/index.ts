#!/usr/bin/env ts-node
import { intro, multiselect, spinner, text } from '@clack/prompts';
import path from 'path';
import fs from 'fs';
import lucia from "./utils";
import postgresqlAdapter from "./utils/adapter/postgresql"
import sqliteAdapter from "./utils/adapter/sqlite"
import { DATABASE } from '../utils/constant';
import { readInternalFiles } from '../utils/readInternalFiles';
import { mutateProjectFiles } from '../utils/mutateProjectFiles';


export const auth = async () => {
    intro('⚡️ Lucia Auth initializer');

    const setupPath = path.join(process.cwd(), 'setup.json');

    if (!fs.existsSync(setupPath)) {
        console.error('setup.json not found. Please run the init command first.');
        process.exit(1);
    }

    // Read the setup.json file
    const setupConfig = JSON.parse(fs.readFileSync(setupPath, 'utf-8'));

    if (!setupConfig?.db?.type) {
        console.error('Please setup Drizzle before setting up Lucia Auth.');
        process.exit(1);
    }

    // Extract the path alias from the config
    const pathAlias = setupConfig.aliases?.path?.replace("*", '') || '';

    // Adjust the appName placeholder to use the path alias if available
    const defaultAppName = pathAlias ? `${pathAlias}auth` : '@/auth';

    const appName = await text({
        message: 'Name your path to the auth folder ?',
        placeholder: defaultAppName,
        validate(value) {
            if (value.length === 0) return `Name cannot be empty.`;
            return ``
        }
    });

    const projectDir = path.resolve(process.cwd(), appName.toString().replaceAll(pathAlias, './src/') as string);

    const authenticationOptions = await multiselect({
        message: 'Select authentication options',
        options: [
            { value: 'password', label: 'Password' },
            { value: 'google', label: 'Google' },
            { value: 'discord', label: 'Discord' },
            { value: 'github', label: 'Github' },
        ],
    });

    const containsOAuth = authenticationOptions.toString().split(',').some((id) => ['google', 'discord', 'github'].includes(id))

    const s = spinner();
    s.start(`Creating your drizzle config...`);

    try {
        // Create project directory if it doesn't exist
        if (!fs.existsSync(projectDir))
            fs.mkdirSync(projectDir, { recursive: true });

        // Write or lucia.ts
        const authFilePath = path.join(projectDir, 'index.ts');

        if (!fs.existsSync(authFilePath))
            fs.writeFileSync(authFilePath, lucia, { flag: 'w' });

        const adapterFilePath = path.join(projectDir, 'adapter.ts');

        if (!fs.existsSync(adapterFilePath)) {
            const adapterFile = ({
                [DATABASE.sqlite]: sqliteAdapter,
                [DATABASE.supabase]: postgresqlAdapter,
                [DATABASE.turso]: sqliteAdapter,
            }[setupConfig?.db?.type as string]).replaceAll('$databasePath', setupConfig?.db?.path as string)
            fs.writeFileSync(adapterFilePath, adapterFile, { flag: 'w' });
        }

        const databaseType = ({
            [DATABASE.sqlite]: 'sqlite',
            [DATABASE.supabase]: 'postgres',
            [DATABASE.turso]: 'sqlite',
        }[setupConfig?.db?.type as string])

        const authSchemaFilePath = path.join(projectDir, 'auth-schema.ts');
        if (!fs.existsSync(authSchemaFilePath)) {
            const authSchemaContent = readInternalFiles(__dirname, `./utils/schema/password/${databaseType}.ts`)
            fs.writeFileSync(authSchemaFilePath, authSchemaContent, { flag: 'w' });
        }

        const oauthSchemaFilePath = path.join(projectDir, 'oauth-schema.ts');

        if (containsOAuth && !fs.existsSync(oauthSchemaFilePath)) {
            const oauthSchemaContent = readInternalFiles(__dirname, `./utils/schema/oauth/${databaseType}.ts`)
            fs.writeFileSync(oauthSchemaFilePath, oauthSchemaContent, { flag: 'w' });
            fs.writeFileSync(authFilePath, lucia.replaceAll('// export *', 'export *'), { flag: 'w' });
        }
        const databaseSchemaPath = `${setupConfig?.db?.path.replace(setupConfig?.aliases?.path.replace("*", ''), setupConfig?.aliases?.aliasSource?.replace("*", ''))}/schema.ts`
        mutateProjectFiles(databaseSchemaPath, (fileContent: string) => {
            const exportAuth = `export * from "${appName.toString()}/auth-schema"`
            const exportOAuth = `export * from "${appName.toString()}/oauth-schema"`

            let initial = fileContent
            if (!initial.includes(exportAuth))
                initial = `${initial}\n${exportAuth}`
            if (containsOAuth && !initial.includes(exportOAuth))
                initial = `${initial}\n${exportOAuth}`
            return initial
        })

        mutateProjectFiles('setup.json', (rawContent: string) => {
            const setupJSON = JSON.parse(rawContent);
            setupJSON['auth'] = {}
            setupJSON['auth']['path'] = appName
            return JSON.stringify(setupJSON, null, 2)
        })

        // s.message('Installing dependencies...')

        // // Install dependencies
        // execSync(
        //     `npm install ${database?.dependencies?.join(' ')}`,
        //     { cwd: projectDir, stdio: 'inherit' }
        // );

        // execSync(
        //     `npm install -D ${database?.devDependencies?.join(' ')}`,
        //     { cwd: projectDir, stdio: 'inherit' }
        // );

        s.stop('Drizzle has been setup! 🎉');
    } catch (err) {
        s.stop('Error occurred while setting up the project.');
        console.error(err);
    }
};
