const dependencies = ['drizzle-orm', '@libsql/client']
const devDependencies = ['drizzle-kit']

const init = `./db/examples/turso/index.ts`
const drizzleKit = `./db/examples/turso/drizzle.config.ts`
const schema = `./db/examples/turso/schema.ts`

export const turso = { init, schema, drizzleKit, dependencies, devDependencies }