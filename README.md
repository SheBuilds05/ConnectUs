# ConnectUs - Smart Services Booking Platform

A dual-platform (Web + Mobile) marketplace connecting customers with trusted local runners who can shop for them. Users can book runners, upload product photos, make secure payments, track bookings, and leave reviews.

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-green.svg" alt="Version 1.0.0" />
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
</div>

---

## ✨ **Features**

**Customers** — Photo requests · Runner discovery · Calendar booking · Secure payments · Reviews & ratings  
**Runners** — Earnings dashboard · Availability management · Job notifications · Rating system · Delivery options  
**Admins** — User management · Platform analytics · Dispute resolution · Safety monitoring · Runner verification

---

## 🛠️ **Tech Stack**

<div align="center">
  <img src="https://skillicons.dev/icons?i=react,vite,tailwind,nodejs,express,postgres,git,github" alt="Development Technologies" />
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</div>

---

## 🏗 **System Architecture**

### Application Flow
```mermaid
graph TD
    A[App Router] --> B{User Role}
    B -->|Public| C[Landing · Login · Register]
    B -->|Customer| D[Home · Bookings · Messages · Favorites · Account]
    B -->|Runner| E[Runner Dashboard · Earnings · Availability · Jobs]
    B -->|Admin| F[Admin Dashboard · Users · Disputes · Analytics]
    
    style A fill:#2D531A,stroke:#0D330E,color:#fff
    style B fill:#477023,stroke:#2D531A,color:#fff

## **Navigation Flow**
graph LR
    A[Login] --> B{Customer}
    A --> C{Runner}
    A --> D{Admin}
    
    B --> E[Browse → Book → Track → Review]
    C --> F[Accept → Shop → Deliver → Get Paid]
    D --> G[Verify → Monitor → Resolve → Analyze]
    
    style A fill:#2D531A,stroke:#0D330E,color:#fff

## **Installation & Setup**
1.Clone Repo
git clone https://github.com/your-username/ConnectUs.git
cd ConnectUs

2.Install Dependencies
cd frontend
npm install
cd mobile
npm install

3. Run
cd frontend
npm run dev
# http://localhost:5173
