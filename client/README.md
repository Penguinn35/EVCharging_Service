# EV Charging Service � Client

## Project Overview

This is a **Next.js 15 + React 19** frontend for an EV charging platform.  
It provides:

- A public map experience for finding and viewing charging stations
- Authentication flows (login/register)
- A dashboard for station management and system insights

---

## Features

- **Public pages**
  - Landing page with product sections
  - Interactive map page (`/Map`)
- **Map experience**
  - Search and quick search for stations
  - Station filtering
  - "Locate me" support
  - Station detail panel
  - Route rendering with Leaflet Routing + GraphHopper
- **Authentication**
  - User registration
  - User login
- **Dashboard**
  - Manage stations
  - High-demand heatmap
  - System statistics (cards/charts/views)
- **State management**
  - Zustand stores for user, station, map, modal, and routing state
- **API integration**
  - Axios clients for public and authenticated requests
  - Token-aware request interceptor and 401 handling

---

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, PostCSS
- **Maps:** Leaflet, React-Leaflet, Leaflet Routing Machine, GraphHopper plugin
- **Charts:** Chart.js, react-chartjs-2
- **State Management:** Zustand
- **HTTP Client:** Axios
- **UI / UX:** React Icons, Font Awesome, Framer Motion, React Toastify
- **Linting:** ESLint (Next config)

---

## Folder Structure

```text
src/
+- app/
�  +- (auth)/
�  �  +- login/page.tsx
�  �  +- register/page.tsx
�  +- (public)/
�  �  +- Map/page.tsx
�  +- dashboard/
�  �  +- high-demand-heatmap/page.tsx
�  �  +- manage-stations/
�  �  �  +- [slug]/
�  �  �  +- page.tsx
�  �  +- system-statistics/page.tsx
�  �  +- layout.tsx
�  �  +- page.tsx
�  +- layout.tsx
�  +- page.tsx
+- components/
�  +- dashboard/
�  +- homePage/
�  +- mapPage/
�  +- Modal.tsx
+- context/
+- hooks/
+- lib/
�  +- apiClient.ts
�  +- data/
+- models/
+- services/
�  +- stationService.ts
�  +- userService.ts
+- store/
+- type/
+- types/
```

---

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create `.env.local` (or `.env`) and set values (see below).

### 3) Run development server

```bash
npm run dev
```

App runs at `http://localhost:3000`.

### Production commands

```bash
npm run build
npm run start
npm run lint
```

---

## Environment Variables

This project uses client-exposed env vars (`NEXT_PUBLIC_*`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8090
NEXT_PUBLIC_API_GRAPHHOPPER=your_graphhopper_api_key
```

Optional (referenced in codebase):

```env
NEXT_PUBLIC_API_BASE_URL=
```

---

## API / Services Explanation

### `src/lib/apiClient.ts`

Defines two Axios instances:

- **`publicApiClient`**  
  For unauthenticated endpoints (e.g., login/register, public station lookup)
- **`apiClient`**  
  For authenticated endpoints:
  - Adds `Authorization: Bearer <accessToken>` from Zustand user store
  - Uses `withCredentials: true`
  - Handles `401` by clearing stored user info

### `src/services/userService.ts`

Main user-related calls:

- `createUser(data)` ? `POST /auth/register`
- `login(data)` ? `POST /auth/login`
- `getUserDetails()` ? `GET /api/users/detail`

### `src/services/stationService.ts`

Main station-related calls:

- `getStationById(stationId)` ? `GET /api/stations/:id`
- `getStationNearBy(coordinate)` ? `GET /api/stations/nearest-station`
- `searchStation(keyword)` ? `GET /api/stations?keyword=...`
- `saveStation(stationId)` ? `POST /api/users/save-stations`
- `deleteSavedStation(stationId)` ? `DELETE /api/users/save-stations`

---

## Screenshots

> Add real screenshots for each key page:

- `docs/screenshots/home.png` � Landing page
- `docs/screenshots/map.png` � Public map page
- `docs/screenshots/dashboard-manage-stations.png` � Manage stations
- `docs/screenshots/dashboard-heatmap.png` � High-demand heatmap
- `docs/screenshots/dashboard-statistics.png` � System statistics
