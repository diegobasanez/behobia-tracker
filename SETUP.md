# Configuración — Behobia Tracker en Vercel + Strava real

## 1. Crear la app en Strava (si no lo has hecho ya)
En https://www.strava.com/settings/api crea una app. Anota:
- **Client ID** (público, se usa en el navegador)
- **Client Secret** (privado — nunca lo pongas en el HTML ni lo subas a GitHub)

En "Authorization Callback Domain" pon el dominio que te dé Vercel después del paso 3
(ej. `behobia-tracker.vercel.app`, sin `https://` ni barras). Puedes dejarlo vacío
por ahora y volver a editarlo cuando tengas la URL final.

## 2. Rellenar el Client ID en el código
Abre `index.html`, busca esta línea cerca del principio del `<script>`:

```js
const STRAVA_CLIENT_ID = 'PON_AQUI_TU_CLIENT_ID';
```

Sustitúyela por tu Client ID real (el número que te da Strava). Este valor **sí**
puede quedar en el código público — no es secreto.

## 3. Subir a GitHub y desplegar en Vercel
1. Sube esta carpeta completa (`index.html` + carpeta `api/`) a tu repositorio.
2. En Vercel: "Add New" → "Project" → importa el repo. No hace falta build command
   ni output directory especiales (Vercel detecta `/api` automáticamente).

## 4. Añadir el Client Secret como variable de entorno
En el proyecto de Vercel: **Settings → Environment Variables**, añade:

| Nombre | Valor |
|---|---|
| `STRAVA_CLIENT_ID` | tu Client ID |
| `STRAVA_CLIENT_SECRET` | tu Client Secret |

Guarda y vuelve a desplegar (Vercel → Deployments → "Redeploy") para que las
funciones de `/api` puedan leer las variables.

## 5. Actualizar el Callback Domain en Strava
Vuelve a https://www.strava.com/settings/api y pon el dominio real que te haya
dado Vercel en "Authorization Callback Domain" (ej. `behobia-tracker.vercel.app`).

## 6. Probar
Abre tu URL de Vercel, pulsa "Conectar con Strava", acepta el acceso, y deberías
volver ya conectado. Los checks se guardan solos en el propio navegador
(localStorage) — si cambias de dispositivo, no se sincronizan entre ellos.

## Notas
- El scope pedido es `activity:read_all` (lee tus actividades, incluidas las
  privadas). Si prefieres que solo lea las públicas, cambia `activity:read_all`
  por `activity:read` en `index.html`.
- Los tokens de acceso de Strava caducan cada 6 horas; el código los refresca
  solo usando el refresh token, también guardado en localStorage.
- El Client Secret nunca viaja al navegador: solo lo usan las funciones de
  `/api`, que corren en el servidor de Vercel.
