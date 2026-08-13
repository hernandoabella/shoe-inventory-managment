# Shoe Inventory Management

Aplicación de gestión de inventario de calzado — **simple pero 100% funcional**.

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS · Prisma + SQLite · Auth con JWT en cookie httpOnly.

## Puertos / servidores

> ⚠️ Si tienes un `next dev`/`next start` corriendo de una sesión anterior en el puerto 3000, úsalo o cámbialo. Para producción: `npm run build && npm run start -p PUERTO`.

## Arranque rápido

```bash
npm install
npx prisma db push      # crea la base de datos SQLite (prisma/dev.db)
npm run db:seed         # puebla datos iniciales (admin + tiendas + productos)
npm run dev             # desarrollo
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

- Base de datos local en `prisma/dev.db` (SQLite). Para resetear: borra `prisma/dev.db` y vuelve a `prisma db push` + `db:seed`.
- Variables en `.env`: `DATABASE_URL` y `JWT_SECRET`.
- Las secciones de Reportes y Configuración tienen páginas base; los reportes
  consumen `/api/reports` (inventory y movements ya funcionando).
- Transferencias, Compras y Recepción funcionan con formularios que crean registros
  reales vía API. Los ajustes de stock (`/dashboard/inventory/adjustments`) crean un
  movement y actualizan el stock de la variante automáticamente.
