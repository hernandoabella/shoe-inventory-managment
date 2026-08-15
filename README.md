# Shoe Inventory Management

Aplicación de gestión de inventario de calzado — **simple pero 100% funcional**.

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS · Prisma + PostgreSQL · Auth con JWT en cookie httpOnly.

## Puertos / servidores

> ⚠️ Si tienes un `next dev`/`next start` corriendo de una sesión anterior en el puerto 3000, úsalo o cámbialo. Para producción: `npm run build && npm run start -p PUERTO`.

## Arranque rápido

```bash
# 1) Copia .env.example a .env y pon tu DATABASE_URL de PostgreSQL
#    (Neon, Supabase, Railway...)
cp .env.example .env

npm install              # también genera el cliente Prisma (postinstall)
npx prisma db push       # crea/actualiza el esquema en la base
npm run db:seed          # puebla datos iniciales (admin + tiendas + productos)
npm run dev              # desarrollo
# o bien producción:
npm run build && npm start
```

La app queda en `http://localhost:3000` (o el puerto que uses).

## Credenciales de acceso

```
Email:    admin@shoe.com
Password: admin123
```

El login valida contra la base de datos (bcrypt) y crea una sesión JWT en cookie
httpOnly. El middleware protege `/dashboard` y redirige a `/login` si no hay sesión.

## Estructura

```
app/
  (auth)/login, (auth)/forgot-password   # autenticación
  dashboard/                              # todas las secciones del panel
  api/                                    # API REST (products, stores, transfers,
                                           movements, purchases, suppliers, users, reports)
components/  layout · dashboard · inventory · products · transfers · ...
lib/         db.ts (Prisma) · auth.ts (JWT) · utils · validations
hooks/       useProducts · useInventory · useStores · useTransfers · useDebounce
types/       product · inventory · store · transfer · purchase · supplier · user
prisma/      schema.prisma · seed.ts
middleware.ts  # protege /dashboard y redirige / -> /dashboard
```

## Notas

- La base de datos es PostgreSQL y se configura con `DATABASE_URL` (Neon, Supabase, Railway...). `JWT_SECRET` firma las sesiones JWT.
- Para resetear datos: `npm run db:reset` (borra el esquema y vuelve a sembrarlo).
- `prisma/dev.db` es un residuo de la versión SQLite: ya no se usa y no debe subirse a Git.

## Deploy en Vercel

1. Crea una base PostgreSQL gratis en [Neon](https://neon.tech) o [Supabase](https://supabase.com) y copia su connection string.
2. En [vercel.com](https://vercel.com) → *Add New Project* → importa el repo de GitHub (Next.js se detecta solo; build: `next build`).
3. En *Settings → Environment Variables* agrega:
   - `DATABASE_URL` → connection string de tu base PostgreSQL
   - `JWT_SECRET` → una cadena larga y aleatoria
4. Desde tu máquina, apuntando a esa misma base: `npx prisma db push` y luego `npm run db:seed` (crea el esquema y el usuario admin).
5. Despliega. Cada `git push` a la rama principal genera un deploy automático.

> El script `postinstall` ejecuta `prisma generate` automáticamente durante el build de Vercel.
- Las secciones de Reportes y Configuración tienen páginas base; los reportes
  consumen `/api/reports` (inventory y movements ya funcionando).
- Transferencias, Compras y Recepción funcionan con formularios que crean registros
  reales vía API. Los ajustes de stock (`/dashboard/inventory/adjustments`) crean un
  movement y actualizan el stock de la variante automáticamente.
