# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

- `backend/`: Spring Boot 3.5 (Java 21) API with PostgreSQL and JWT-based auth.
- `client/`: Next.js 15 (App Router) frontend with Zustand state and Leaflet map UI.

## Common commands

### Backend (Spring Boot)

Run from `backend/`:

- Install/build: `./mvnw clean package`
- Run dev server: `./mvnw spring-boot:run`
- Run all tests: `./mvnw test`
- Run a single test class: `./mvnw -Dtest=BackendApplicationTests test`
- Run a single test method: `./mvnw -Dtest=BackendApplicationTests#contextLoads test`

### Frontend (Next.js)

Run from `client/`:

- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Production build: `npm run build`
- Start production server: `npm run start`
- Lint: `npm run lint`

Note: there is currently no dedicated frontend test script in `client/package.json`.

## Runtime configuration

### Backend environment

Backend loads environment values from `.env` via `spring.config.import=optional:file:.env[.properties]`.
Required DB settings are used in `backend/src/main/resources/application.properties`:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`

JPA is configured with `spring.jpa.hibernate.ddl-auto=update`.

### Frontend environment

Frontend API clients read `NEXT_PUBLIC_API_URL` (see `client/src/lib/apiClient.ts`).

## High-level architecture

### Backend architecture (layered Spring app)

- Entry point: `backend/src/main/java/com/dacn/backend/BackendApplication.java`
- HTTP layer: controllers under `controller/` (`Authenticator`, `ClientController`, `BusinessController`).
- Business layer: services under `service/` (`UserService`, `StationService`, `MyUserDetailsService`).
- Persistence layer: Spring Data repositories under `repository/`.
- Data model: JPA entities under `model/` and request/response DTOs under `dto/`.

Auth flow and authorization:

1. Login/register endpoints are under `/auth/**` (`Authenticator`).
2. JWT is created/validated in `UserService`.
3. `JwtFilter` reads `Authorization: Bearer ...` and populates Spring Security context.
4. `SecurityConfig` enforces role-based access:
   - `/api/client/**` requires `CLIENT`
   - `/api/business/**` requires `BUSINESS`
   - Swagger/OpenAPI and `/auth/**` are public

Station search and recommendation logic:

- `StationService` delegates to `ChargingStationRepo` native SQL queries for keyword search, nearby stations, and connector-type suggestion.
- Keyword search expects PostgreSQL `unaccent` extension support.

### Frontend architecture (Next.js App Router + Zustand)

Routing structure:

- Public marketing homepage: `client/src/app/page.tsx`
- Auth pages: `client/src/app/(auth)/...`
- Map experience: `client/src/app/(public)/Map/page.tsx`
- Dashboard area: `client/src/app/dashboard/...` with shared dashboard layout/nav

State management:

- Zustand stores in `client/src/store/`:
  - `useUserStore`: auth token, profile, saved stations, plug preferences
  - `useStationStore`: station lists, selected station
  - `useRoutingStore` / `useMapStore` / `useModalStore`: map and UI behavior

API integration pattern:

- Central Axios clients in `client/src/lib/apiClient.ts`
  - `publicApiClient` for public endpoints
  - `apiClient` adds bearer token from Zustand and clears user state on 401
- Feature-level service wrappers in `client/src/services/` (`userService.ts`, `stationService.ts`)

Map feature composition:

- Leaflet map rendering and marker selection logic live in `client/src/components/mapPage/Map.tsx`.
- Station detail fetch on marker click uses `getStationById` and updates `useStationStore`.
- Route drawing is controlled via routing store state.

Dashboard feature status:

- Dashboard UI is split into manage-stations, system-statistics, and heatmap components.
- Much of dashboard data currently comes from local mock data under `client/src/lib/data/` rather than backend APIs.

## API docs

Swagger/OpenAPI is enabled via Springdoc and security config allows access to:

- `/v3/api-docs`
- `/swagger-ui/index.html`
