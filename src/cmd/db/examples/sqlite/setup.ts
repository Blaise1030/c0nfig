const dependencies = ['drizzle-orm', 'better-sqlite3']
const devDependencies = ['drizzle-kit']

const init = `./examples/sqlite/index.ts`
const drizzleKit = `./examples/sqlite/drizzle.config.ts`
const schema = `./examples/sqlite/schema.ts`


export const sqlite = { init, schema, drizzleKit, dependencies, devDependencies }