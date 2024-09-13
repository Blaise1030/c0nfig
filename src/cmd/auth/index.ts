#!/usr/bin/env ts-node
import { intro, spinner, text } from '@clack/prompts';
import path from 'path';
import fs from 'fs';
import { lucia } from './lucia';
import { DATABASE } from '../constant';


export const auth = async () => {
    intro('⚡️ Lucia Auth initializer');

    const setupPath = path.join(process.cwd(), 'setup.json');

    if (!fs.existsSync(setupPath)) {
        console.error('setup.json not found. Please run the init command first.');
        process.exit(1);
    }

    // Read the setup.json file
    const setupConfig = JSON.parse(fs.readFileSync(setupPath, 'utf-8'));

    if (!setupConfig.dbType) {
        console.error('Please setup Drizzle before setting up Lucia Auth.');
        process.exit(1);
    }

    // Extract the path alias from the config
    const pathAlias = setupConfig.aliases?.path?.replace("*", '') || '';

    // Adjust the appName placeholder to use the path alias if available
    const defaultAppName = pathAlias ? `${pathAlias}auth` : '@/auth';

    const appName = await text({
        message: 'Where do you want to store your database ?',
        placeholder: defaultAppName,
        validate(value) {
            if (value.length === 0) return `Name cannot be empty.`;
            return ``
        }
    });

    const projectDir = path.resolve(process.cwd(), appName.toString().replaceAll(pathAlias, './src/') as string);

    // const authenticationOptions = await multiselect({
    //     message: 'Select authentication options',
    //     options: [
    //         { value: 'password', label: 'Password' },
    //         { value: 'google', label: 'Google' },
    //         { value: 'discord', label: 'Discord' },
    //         { value: 'github', label: 'Github' },
    //     ],
    // });


    const s = spinner();
    s.start(`Creating your drizzle config...`);

    try {
        // Create project directory if it doesn't exist
        if (!fs.existsSync(projectDir))
            fs.mkdirSync(projectDir, { recursive: true });

        // Write or overwrite lucia.ts
        const authFilePath = path.join(projectDir, 'index.ts');
        fs.writeFileSync(authFilePath, lucia({
            [DATABASE.sqlite]: 'DrizzleSQLiteAdapter',
            [DATABASE.supabase]: 'DrizzlePostgreSQLAdapter',
            [DATABASE.turso]: 'DrizzleSQLiteAdapter'
        }[setupConfig?.dbType]), { flag: 'w' });
        // // Write or overwrite schema.ts
        // const schemaFilePath = path.join(projectDir, 'schema.ts');
        // fs.writeFileSync(schemaFilePath, database?.schema, { flag: 'w' });

        // // Write or overwrite drizzle.config.ts
        // const drizzleConfigPath = path.resolve(process.cwd(), 'drizzle.config.ts');
        // fs.writeFileSync(drizzleConfigPath, database?.drizzleKit(appName?.toString()), { flag: 'w' });

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
