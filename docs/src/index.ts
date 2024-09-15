import { serveStatic } from '@hono/node-server/serve-static'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.use('/assets/*', serveStatic({ root: './assets' }))
app.get(
  '/assets/*',
  serveStatic({
    root: './',
    rewriteRequestPath: (path) =>
      path.replace(/^\/static/, '/statics'),
  })
)


const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
