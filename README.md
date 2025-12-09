# Wallywood API

En TypeScript/Express API til film plakat webshop med JWT authentication og CRUD operationer.

## Kom i gang

### Installation

```bash
git clone https://github.com/MathiasOliverNielsen/wallywood-api-ts.git
cd wallywood-api-ts
npm install
```

### Opsætning

1. Opret `.env` fil med database connection
2. Kør `npx prisma migrate dev`
3. Import test data: `npm run prisma:reset`
4. Start server: `npm run dev`

API kører på `http://localhost:3000`

## Projekt struktur

```
src/
├── controllers/     # Request handlers
├── middleware/      # Auth middleware
├── routes/         # Route definitions
└── services/       # Business logic

prisma/
├── schema.prisma   # Database schema
├── csv/           # Test data filer
└── seedCSV.ts     # Data import script
```

## Authentication

### Refresh Token System

- **Access tokens**: Kort levetid (15 minutter)
- **Refresh tokens**: Langtids tokens gemt i database
- **Automatisk fornyelse**: Få ny access token uden at logge ind igen
- **Sikker logout**: Invalidér refresh token i database

### Login flow

1. POST `/api/login` → få access + refresh tokens
2. Brug access token i Authorization header (Bearer token)
3. POST `/api/login/refresh` → forny tokens når access token udløber
4. POST `/api/login/logout` → log ud og invalidér refresh token

### Token format

**Login response:**

```json
{
  "message": "Login succesfuld",
  "user": {...},
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "a1b2c3d4e5f6..."
}
```

### Test brugere

```json
Admin: {"email": "info@webudvikler.dk", "password": "password"}
User:  {"email": "alm@webudvikler.dk", "password": "password"}
```

## API endpoints

### Authentication

- `POST /api/login` - Login
- `POST /api/login/refresh` - Forny token
- `POST /api/login/logout` - Logout
- `GET /api/login/authenticate` - Verificer token
- `GET /api/login/authorize` - Test admin adgang

### Data endpoints

- `GET/POST/PUT/DELETE /api/users` - Brugere
- `GET/POST/PUT/DELETE /api/posters` - Plakater
- `GET/POST/PUT/DELETE /api/genres` - Genrer
- `GET/POST/PUT/DELETE /api/cartlines` - Indkøbskurv
- `GET/POST/PUT/DELETE /api/ratings` - Vurderinger

## Postman test

### 1. Environment variabler

```json
{
  "baseUrl": "http://localhost:3000",
  "accessToken": "",
  "refreshToken": ""
}
```

### 2. Test flow

1. Login for at få tokens
2. Test beskyttede routes med Bearer token
3. CRUD operationer på data

### 3. Eksempel requests

**Login:**

```json
POST {{baseUrl}}/api/login
{
  "email": "info@webudvikler.dk",
  "password": "password"
}
```

**Tilføj til kurv:**

```json
POST {{baseUrl}}/api/cartlines
{
  "userId": 1,
  "posterId": 3988,
  "quantity": 2
}
```

**Opret bruger:**

```json
POST {{baseUrl}}/api/users
{
  "firstname": "Test",
  "lastname": "User",
  "email": "test@test.dk",
  "password": "password123",
  "role": "USER"
}
```

## Database

### Modeller

- User - Brugerkonti
- Poster - Film plakater
- Genre - Kategorier
- Cartline - Indkøbskurv
- UserRating - Bruger vurderinger
- GenrePosterRel - Genre relationer

### Database tools

- Prisma Studio: `npx prisma studio` (http://localhost:5555)
- Reset database: `npm run prisma:reset`

## Fejlfinding

**"Cannot POST /api/login"** - Server ikke startet
**"User/Poster not found"** - Check ID'er med GET requests
**"Token expired"** - Brug refresh endpoint eller log ind igen

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build til production
npm run prisma:reset # Reset database med test data
npx prisma studio    # Åbn database browser
```
