const dependencies = ['drizzle-orm', '@libsql/client']
const devDependencies = ['drizzle-kit']

const init = `./examples/turso/index.ts`
const drizzleKit = `./examples/turso/drizzle.config.ts`
const schema = `./examples/turso/schema.ts`

export const turso = { init, schema, drizzleKit, dependencies, devDependencies }