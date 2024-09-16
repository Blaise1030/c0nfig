#!/usr/bin/env ts-node
import { intro, multiselect, spinner, text } from '@clack/prompts';
import path from 'path';
import fs from 'fs';
import { DATABASE } from '../utils/constant';
import { mutateProjectFiles } from '../utils/mutateProjectFiles';
import { fetchConfig } from '../utils/fetchConfig';
import { TAuthConfigStruct, TAuthDBConfigStruct } from '../utils/types';
import { fetchFilesAsString } from '../utils/fetchFilesAsString';
import { execSync } from 'child_process';


export const authInit = async () => {
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

    const projectName = appName.toString().replaceAll(pathAlias, setupConfig['aliases']['aliasSource']).replaceAll('*', '') as string
    const projectDir = path.resolve(process.cwd(), projectName);

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

    const dbType = ({
        [DATABASE.sqlite]: 'sqlite',
        [DATABASE.supabase]: 'postgres',
        [DATABASE.turso]: 'sqlite',
    }[setupConfig?.db?.type as string])

    const config = await fetchConfig() as { auth: TAuthConfigStruct }
    const authDBConfig = config['auth']['db'][dbType as string] as TAuthDBConfigStruct

    const s = spinner();
    s.start(`Creating your auth config...`);

    try {
        // Create project directory if it doesn't exist
        if (!fs.existsSync(projectDir))
            fs.mkdirSync(projectDir, { recursive: true });

        // Write index.ts
        const authFilePath = path.join(projectDir, 'index.ts');
        const lucia = await fetchFilesAsString(config['auth']['index'])
        if (!fs.existsSync(authFilePath))
            fs.writeFileSync(authFilePath, lucia, { flag: 'w' });

        const adapterFilePath = path.join(projectDir, 'adapter.ts');

        if (!fs.existsSync(adapterFilePath)) {
            const result = await fetchFilesAsString(authDBConfig['adapter'])
            const adapterFile = result.replaceAll('$databasePath', setupConfig?.db?.path as string)
            fs.writeFileSync(adapterFilePath, adapterFile, { flag: 'w' });
        }

        const authSchemaFilePath = path.join(projectDir, 'auth-schema.ts');
        if (!fs.existsSync(authSchemaFilePath)) {
            const result = await fetchFilesAsString(authDBConfig['auth-schema'])
            fs.writeFileSync(authSchemaFilePath, result, { flag: 'w' });
        }

        const oauthSchemaFilePath = path.join(projectDir, 'oauth-schema.ts');

        if (containsOAuth && !fs.existsSync(oauthSchemaFilePath)) {
            const result = await fetchFilesAsString(authDBConfig['oauth-schema'])
            fs.writeFileSync(oauthSchemaFilePath, result, { flag: 'w' });
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

        s.message('Installing dependencies...')

        // Install dependencies
        execSync(
            `npm install ${config?.auth?.dependencies?.join(' ')}`,
            { cwd: projectDir, stdio: 'inherit' }
        );

        s.stop('Drizzle has been setup! 🎉');
    } catch (err) {
        s.stop('Error occurred while setting up the project.');
        console.error(err);
    }
};
