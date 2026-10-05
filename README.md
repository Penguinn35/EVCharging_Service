# EV Charging Station Management & Search System (https://www.ev-charging-service.site/)

**Graduation Project (HK252)** - Faculty of Computer Science and Engineering, Ho Chi Minh City University of Technology (HCMUT) - VNU-HCM.

## 📖 Introduction
This project is a centralized platform for EV charging station information, built to address the "Range Anxiety" commonly experienced by electric vehicle users in Vietnam.

The system provides a comprehensive solution for two main target audiences:
- **End-users:** Assists in searching, navigating, reviewing, and managing charging station information intuitively on a map.
- **Business Operators (CPO/Admin):** Provides tools for station management, user data analysis, and heatmaps to evaluate demand and support infrastructure planning decisions.

## ✨ Key Features

### For Users (End-users)
- 🗺️ **Visual Map:** Displays charging stations around the user's current location.
- 🔍 **Search & Filter:** Filter stations by distance, connector type, power output, ratings, etc.
- 📍 **Routing:** Finds the shortest path to the desired charging station using the Dijkstra algorithm.
- ⭐ **Reviews & Feedback:** Allows users to leave comments and ratings for charging stations.
- 🚗 **Personalization:** Save personal vehicle information and favorite charging stations.

### For Businesses (Business/CPO)
- 🏢 **Station Management:** Add, edit, delete, and update the status of managed charging stations.
- 📊 **Statistics & Reports:** Track user interest metrics, views, and review counts.
- 🌡️ **Heatmap:** Visualize the density of search demand and station usage, helping to identify "hotspots" for future infrastructure investments.

## 🛠️ Technology Stack

The project is built on a Layered Architecture combined with RESTful APIs:
- **Frontend:** Next.js
- **Backend:** Java Spring Boot
- **Database:** PostgreSQL
- **Map & Geocoding:** OpenStreetMap (OSM)
- **Routing Algorithm:** Dijkstra / Equivalent Routing Services

## 🚀 Installation

Follow these steps to set up the project locally:

```
1. Clone the repository
git clone [https://github.com/your-username/ev-charging-management.git](https://github.com/your-username/ev-charging-management.git)

2. Setup Database (PostgreSQL)
Setup a Postgres

# 3. Run Backend (Spring Boot)
cd backend
./mvnw spring-boot:run

# 4. Run Frontend (Next.js)
cd frontend
npm install
npm run dev
```

## 👥 Contributors
- Nguyễn Sỹ Công (Student ID: 2210409)

- Nguyễn Minh Toàn (Student ID: 2213533)

- Supervisor: MSc. Trần Trương Tuấn Phát

## 🙏 Acknowledgments
We would like to express our deepest gratitude to our supervisor, MSc. Trần Trương Tuấn Phát, for his dedicated guidance. We also extend our thanks to the professors and lecturers at the Faculty of Computer Science and Engineering - HCMUT for providing the valuable knowledge that made this project possible.
