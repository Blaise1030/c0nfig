const dependencies = ['drizzle-orm', 'postgres']
const devDependencies = ['drizzle-kit']

const init = `./db/examples/supabase/index.ts`
const drizzleKit = `./db/examples/supabase/drizzle.config.ts`
const schema = `./db/examples/supabase/schema.ts`

export const supabase = { init, schema, drizzleKit, dependencies, devDependencies }