# Shared Allocator Service

This service provides a shared condition pool for the wave-2 top-up study.

## Render Deployment

This repo includes a root-level [render.yaml](/abs/path/c:/Users/LuisaF/Documents/New%20project/render.yaml:1) that defines a Render web service for this allocator.

Render setup notes:

- Use the repo `LuisaSusanneFlaig/LiverCancer-second-wave`
- The service root directory is `allocator-service`
- The service uses a persistent disk mounted at `/opt/render/project/src/data`
- The allocator state file is stored under that disk-backed directory

Why the disk is required:

- Render's filesystem is ephemeral by default, so writes are lost across redeploys and restarts without a persistent disk.
- Persistent disks are supported for paid web services, and Render's docs describe Node source code as living under `/opt/render/project/src`, which makes `/opt/render/project/src/data` a valid mount path.

Relevant docs:

- Render Web Services: https://render.com/docs/web-services
- Render Persistent Disks: https://render.com/docs/disks
- Render Blueprint YAML: https://render.com/docs/blueprint-spec

Suggested manual values in Render:

- `ALLOCATOR_ADMIN_TOKEN`
  - set this manually in the Render dashboard
- `ALLOCATOR_ALLOWED_ORIGINS`
  - default in `render.yaml` is `https://luisasusanneflaig.github.io`
  - if you later use a custom domain, update this value to that origin

## Start

From [Leberstory/package.json](/abs/path/c:/Users/LuisaF/Documents/New%20project/Leberstory/package.json:1):

```powershell
npm run allocator:server
```

Or directly:

```powershell
node allocator-service/server.mjs
```

## Environment Variables

- `PORT`
  - Default: `8787`
- `HOST`
  - Default: `0.0.0.0`
- `ALLOCATOR_DATA_FILE`
  - Optional path for persistent allocator state JSON
- `ALLOCATOR_ADMIN_TOKEN`
  - Required for reset and replace endpoints
- `ALLOCATOR_ALLOWED_ORIGINS`
  - Comma-separated list of allowed origins, or `*`

## Frontend Connection

Set in [Leberstory/.env.example](/abs/path/c:/Users/LuisaF/Documents/New%20project/Leberstory/.env.example:1):

```env
VITE_ALLOCATOR_API_URL=http://localhost:8787
```

Then run the app with `allocator=quota` in the URL.

For production on GitHub Pages, set `VITE_ALLOCATOR_API_URL` to your Render service URL before building the frontend.

## Endpoints

- `GET /health`
- `GET /api/allocator/state`
- `POST /api/allocator/allocate`
  - body: `{ "pid": "participant-id" }`
- `POST /api/allocator/reset`
  - requires `Authorization: Bearer <token>`
- `POST /api/allocator/replace`
  - requires `Authorization: Bearer <token>`
  - body: `{ "remainingByCond": { "1": 2, ... } }`

## Example Reset

```powershell
$headers = @{ Authorization = "Bearer YOUR_TOKEN" }
Invoke-RestMethod -Method Post -Uri "http://localhost:8787/api/allocator/reset" -Headers $headers
```

## Example Replace

```powershell
$headers = @{ Authorization = "Bearer YOUR_TOKEN"; "Content-Type" = "application/json" }
$body = @{
  remainingByCond = @{
    "1" = 2
    "2" = 6
    "3" = 5
    "4" = 8
    "5" = 15
    "6" = 12
    "7" = 14
    "8" = 0
    "9" = 6
  }
} | ConvertTo-Json -Depth 3
Invoke-RestMethod -Method Post -Uri "http://localhost:8787/api/allocator/replace" -Headers $headers -Body $body
```
