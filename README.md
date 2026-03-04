# ConnectUs - Smart Services Booking Platform

A dual-platform (Web + Mobile) marketplace connecting customers with trusted local runners who can shop for them. Users can book runners, upload product photos, make secure payments, track bookings, and leave reviews.

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-green.svg" alt="Version 1.0.0" />
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
</div>

---

## ✨ **Features**

**Customers**
- Photo-based product requests | Runner discovery by category | Calendar booking | Secure payments | Reviews & ratings

**Runners**
- Earnings dashboard | Availability management | Job notifications | Rating system | Delivery options (walk/courier)

**Admins**
- User management | Platform analytics | Dispute resolution | Safety monitoring

---

## 🛠️ **Tech Stack**

### 💻 **Development Technologies**
<div align="center">
  <img src="https://skillicons.dev/icons?i=react,vite,tailwind,nodejs,express,postgres,git,github" alt="Development Technologies" />
</div>

### 🎨 **Frontend**
<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</div>

### 📱 **Mobile**
<div align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
</div>

### 🖥️ **Backend** (Planned)
<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</div>

---

## 🏗 **System Architecture**

### Application Flow Diagram
The application uses React Router v6 within `App.jsx` to handle seamless transitions between public pages, customer app, runner dashboard, and admin panel.

```mermaid
graph TD
    A[App.jsx - Router] --> B{Route Type}
    
    B -->|Public Routes| C[LandingPage /]
    B -->|Public Routes| D[LoginPage /login]
    B -->|Public Routes| E[RegisterPage /register]
    
    B -->|Customer Routes| F[MainLayout with Sidebar]
    F --> G[UserHomePage /home]
    F --> H[BookingsPage /bookings]
    F --> I[MessagesPage /messages]
    F --> J[FavoritesPage /favorites]
    F --> K[AccountPage /account]
    
    B -->|Runner Routes| L[RunnerLayout]
    L --> M[RunnerDashboard /runner/dashboard]
    L --> N[EarningsPage /runner/earnings]
    L --> O[AvailabilityPage /runner/availability]
    L --> P[JobHistoryPage /runner/jobs]
    
    B -->|Admin Routes| Q[AdminLayout]
    Q --> R[AdminDashboard /admin]
    Q --> S[UserManagement /admin/users]
    Q --> T[DisputeResolution /admin/disputes]
    Q --> U[AnalyticsPage /admin/analytics]
    
    style A fill:#2D531A,stroke:#0D330E,color:#fff
    style B fill:#477023,stroke:#2D531A,color:#fff
    style F fill:#6E8649,stroke:#2D531A,color:#fff
    style L fill:#C5A059,stroke:#1A1A1A,color:#fff
    style Q fill:#C5A059,stroke:#1A1A1A,color:#fff
