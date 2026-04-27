# Shared Allocator Service

This service provides a shared condition pool for the wave-2 top-up study.

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
