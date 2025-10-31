import dotenv from 'dotenv';
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

// Cargar variables de entorno
dotenv.config();

const app = new Hono();

// Middleware para servir archivos estáticos
app.use('/static/*', serveStatic({ root: './public' }));

// Ruta principal - redireccionar a la página de gestión
app.get('/', (c) => {
  return c.redirect('/students');
});

const port = parseInt(process.env.PORT || '3000');

console.log(`🚀 Servidor iniciado en http://localhost:${port}`);
serve({
  fetch: app.fetch,
  port
});

export default app;