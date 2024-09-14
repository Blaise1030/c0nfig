const dependencies = ['drizzle-orm', 'postgres']
const devDependencies = ['drizzle-kit']

const init = `./examples/supabase/index.ts`
const drizzleKit = `./examples/supabase/drizzle.config.ts`
const schema = `./examples/supabase/schema.ts`

export const supabase = { init, schema, drizzleKit, dependencies, devDependencies }