# ConnectUs# ConnectUs - Smart Services Booking Platform

A dual-platform (Web + Mobile) marketplace connecting customers with local runners who can shop for them. Users can book runners, upload product photos, make secure payments, track bookings, and leave reviews.

---

## 🚀 **Live Demo**
[Coming Soon]

---

## 📸 **Screenshots**
| Home Page | Runner Details | Bookings |
|-----------|----------------|----------|
| [Image 1] | [Image 2]      | [Image 3] |

---

## ✨ **Features**
- 📸 **Photo-based product requests** - Upload exactly what you want
- 🔍 **Runner discovery** - Find runners by category or specialty
- 📅 **Calendar booking** - Schedule shopping slots
- 💳 **Secure payments** - Escrow system for safety
- ⭐ **Reviews & ratings** - Build trust in the community
- 🚚 **Hybrid delivery** - Runners can walk or use couriers

---

## 🏗 **System Architecture**

### Application Flow Diagram
The application uses React Router v6 within `App.jsx` to handle seamless transitions between public pages, the main app layout, and admin dashboard.

```mermaid
graph TD
    A[App.jsx - Router] --> B{Route Type}
    
    B -->|Public Routes| C[LandingPage]
    B -->|Public Routes| D[LoginPage]
    B -->|Public Routes| E[RegisterPage]
    
    B -->|App Layout| F[MainLayout with Sidebar]
    F --> G[UserHomePage /home]
    F --> H[BookingsPage /bookings]
    F --> I[MessagesPage /messages]
    F --> J[FavoritesPage /favorites]
    F --> K[AccountPage /account]
    
    B -->|Admin Routes| L[AdminDashboard /admin/*]
    
    style A fill:#2D531A,stroke:#0D330E,color:#fff
    style B fill:#477023,stroke:#2D531A,color:#fff
    style F fill:#6E8649,stroke:#2D531A,color:#fff
    style L fill:#C5A059,stroke:#1A1A1A,color:#fff
