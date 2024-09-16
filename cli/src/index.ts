import { drizzle_init } from './cmd/db';
import { authInit } from "./cmd/auth"
import { cmdInit } from "./cmd/init"

const args = process.argv

const APPS = {
    INIT: 'init',
    AUTH: 'auth',
    DB: 'db',
}

switch (args[2]) {
    case APPS.DB:
        drizzle_init();
        break;
    case APPS.INIT:
        cmdInit();
        break;
    case APPS.AUTH:
        authInit();
        break;
    default:
        console.log(`Please select a params ${Object.values(APPS).join(',')}`)
}
