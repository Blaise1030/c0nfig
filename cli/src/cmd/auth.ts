#!/usr/bin/env ts-node
import { DATABASE, fetchConfig, mutateProjectFiles, fetchFilesAsString, type TAuthConfigStruct, type TAuthDBConfigStruct, getSetupConfig, getModuleAbsolutePath, getModuleAliasPath } from './utils';
import { intro, select, spinner, text } from '@clack/prompts';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export const authInit = async () => {
    intro('⚡️ Lucia Auth initializer');

    const setupConfig = getSetupConfig()

    if (!setupConfig?.db?.type) {
        console.error('Please setup Drizzle before setting up Lucia Auth.');
        process.exit(1);
    }

    const appName = await text({
        message: 'Enter the folder name for authentication',
        placeholder: "auth",
        validate(value) {
            if (value.length === 0) return `Name cannot be empty.`;
            return ``
        }
    });

    mutateProjectFiles('setup.json', (rawContent: string) => {
        const setupJSON = JSON.parse(rawContent);
        setupJSON['auth'] = {}
        setupJSON['auth']['name'] = appName
        return JSON.stringify(setupJSON, null, 2)
    })

    const projectDir = getModuleAbsolutePath('auth');

    const shouldSetupOAuth = await select<{ value: boolean, label: string }[], boolean>({
        message: 'Do you want to setup OAuth ?',
        options: [
            { value: true, label: 'Yes' },
            { value: false, label: 'No' },
        ],
    });

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
        fs.writeFileSync(authFilePath, lucia, { flag: 'w' });

        // Write adapter.ts
        const adapterFilePath = path.join(projectDir, 'adapter.ts');
        const adapterContent = await fetchFilesAsString(authDBConfig['adapter'])
        const adapterFile = adapterContent.replaceAll('$databasePath', getModuleAliasPath('db') as string)
        fs.writeFileSync(adapterFilePath, adapterFile, { flag: 'w' });

        // Write auth-schema.ts
        const authSchemaFilePath = path.join(projectDir, 'auth-schema.ts');
        const authSchemaContent = await fetchFilesAsString(authDBConfig['auth-schema'])
        fs.writeFileSync(authSchemaFilePath, authSchemaContent, { flag: 'w' });

        const dbProjectDir = getModuleAbsolutePath('db');

        mutateProjectFiles(`${dbProjectDir}/schema.ts`, (fileContent: string) => {
            const exportAuth = `export * from "${getModuleAliasPath('auth')}/auth-schema"`
            let initial = fileContent
            if (!initial.includes(exportAuth))
                initial = `${initial}\n${exportAuth}`
            return initial
        })

        // Write oauth-schema.ts
        if (shouldSetupOAuth) await setupOAuth({ authDBConfig })

        s.message('Installing dependencies...')

        // Install dependencies
        execSync(
            `npm install ${config?.auth?.dependencies?.join(' ')}`,
            { cwd: projectDir, stdio: 'inherit' }
        );

        s.stop('Auth has been setup! 🎉');
    } catch (err) {
        s.stop('Error occurred while setting up the project.');
        console.error(err);
    }
};

// export const add = async () => {
//     intro('⚡️ Add new auth initializer');

//     const item = multiselect({
//         message: 'Select the authentication you would like to add.',
//         options: [{
//             value: '',
//             label: ''
//         }, {
//             value: '',
//             label: ''
//         }]
//     })



//     const s = spinner();
//     s.start(`Creating your auth config...`);
//     try {




//     } catch (e) {

//     }
// };


async function setupOAuth({ authDBConfig }: { authDBConfig: TAuthDBConfigStruct }) {
    const authProjectDir = getModuleAbsolutePath('auth');
    const dbProjectDir = getModuleAbsolutePath('db');
    const result = await fetchFilesAsString(authDBConfig['oauth-schema'])

    // Creates the oauth schema file
    const oauthSchemaFilePath = path.join(authProjectDir, 'oauth-schema.ts');
    fs.writeFileSync(oauthSchemaFilePath, result, { flag: 'w' });

    // Append the oauth schema file from the index module
    const luciaIndexFilePath = path.join(authProjectDir, 'index.ts')
    fs.writeFileSync(luciaIndexFilePath, '\n export * from "./oauth-schema"', { flag: 'a' });

    // Append exports in the schema
    mutateProjectFiles(`${dbProjectDir}/schema.ts`, (fileContent: string) => {
        const exportAuth = `export * from "${getModuleAliasPath('auth')}/oauth-schema"`
        let initial = fileContent
        if (!initial.includes(exportAuth))
            initial = `${initial}\n${exportAuth}`
        return initial
    })

}