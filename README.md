<<<<<<< HEAD
# 💊 MediReach: AI-Powered Medicine Information, Availability & Access Platform

MediReach is a full-stack, production-grade healthcare application built for live hackathon and Smart India Hackathon (SIH) demonstrations. It connects **Patients**, **Pharmacies**, and **AI Intelligence** to solve medicine search friction, stock opacity, stale inventory, and shortage risks.

---

## 🌟 Key Features

1. **Procedural 3D Visual Hero**: Three.js & `@react-three/fiber` central *MediReach AI Intelligence Core* representing medical data networks and AI processing.
2. **Prescription OCR & Fuzzy Extraction**: Optical character recognition (Tesseract.js) + Fuse.js fuzzy string matching to parse handwritten/printed OPD slips into verified database medicines.
3. **Smart Access Ranking Algorithm**: Ranks nearby pharmacies using normalized score:
   $$\text{AccessScore} = 0.40 \cdot \text{Availability} + 0.20 \cdot \text{Proximity} + 0.15 \cdot \text{Price} + 0.15 \cdot \text{Freshness} + 0.10 \cdot \text{PickupSpeed}$$
4. **Real-Time Inventory Synchronization**: Socket.io links pharmacy stock updates directly to active patient discovery cards in real-time.
5. **Reservation & QR Voucher System**: Patients can reserve medicine stock, select pickup slots, and generate digital QR codes (`MR-2026-XXXXXX`).
6. **Demand Forecasting & Stockout Risk**: Recharts visualization calculating estimated days until stockout and replenishment recommendations ($Stock / DailyDemand$).
7. **MediReach Floating AI Assistant**: Interactive chat widget answering medication queries and platform guidance with mandatory educational disclaimers.

---

## 🔑 Demo User Accounts

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@medireach.demo` | `demo1234` | Patient Portal, Prescription OCR, Medicine Search & Reservation |
| **Pharmacy** | `pharmacy@medireach.demo` | `demo1234` | Stock Management, Real-time Inventory Broadcast, Analytics |
| **Admin** | `admin@medireach.demo` | `demo1234` | Global System Overview, Partner Verification, Audit Stream |

---

## 🚀 Quick Start Instructions

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 1. Start Backend Server
```bash
cd server
npm install
npm run dev
```
*Note: Backend automatically seeds 30+ medicines, 10 pharmacies, 100+ inventory records, and demand history in `DEMO_MODE`.*

### 2. Start Frontend Application
In a separate terminal window:
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Three.js, `@react-three/fiber`, `@react-three/drei`, Lucide React, Recharts, Leaflet, Socket.io-client, Fuse.js, Tesseract.js.
- **Backend**: Node.js, Express.js, Socket.io, REST APIs, JWT, bcryptjs, Mongoose, Multer.
- **Database**: MongoDB (with automatic in-memory runner fallback for demo mode).

---

## 👨‍💻 Developed By

**TechBUDDIES**
- Prashant Kumar



## MediReach dataset & live medicine access

This build includes `server/seed/medicineDataset.json` and `server/seed/inventoryDataset.json`, imported from the supplied 1,200-row medicine spreadsheet. The in-memory demo mode exposes the dataset through authenticated medicine search and pharmacy availability APIs.

### Pharmacy owner
The Pharmacy Dashboard now has **Add Medicine**. A pharmacy owner can manually publish a medicine with name, generic name, manufacturer, strength, form, price, opening stock, SKU and prescription flag. The inventory update is broadcast through Socket.io so patient availability refreshes without a manual reload.

### Night-time route
Patient pharmacy discovery includes **Safe Route**. MediReach reads the patient's live browser location, checks the pharmacy's live opening status, obtains a road route when the routing service is available, and returns a safety-aware access score. At night (20:00–05:59 IST) it prioritizes currently-open/verified access. The score is not a guarantee of street-level safety; users should follow local conditions and official navigation guidance.

### Demo credentials
- Patient: `patient@medireach.demo` / `demo1234`
- Pharmacy: `pharmacy@medireach.demo` / `demo1234`
- Admin: `admin@medireach.demo` / `demo1234`
=======
# mediReach-AI-powered-smart-medicine-plateform-
MediReach is a healthcare platform that helps users easily find medical services, connect with healthcare providers, and access essential health information in one place.
>>>>>>> 557b74e1ebef65e38742dcc807342b6d72799b79
