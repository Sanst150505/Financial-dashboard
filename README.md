# FinDash

A responsive finance dashboard UI built with React and Vite for the internship assignment. The application focuses on presenting financial activity clearly through summary cards, charts, insights, and a transaction management view, while keeping the implementation frontend-only and easy to follow.

## Live Demo

https://financial-dashboard-chi-plum.vercel.app

## Project Overview

This project simulates a simple personal finance dashboard where users can:

- view an overall financial summary
- explore transactions with search, filters, and sorting
- understand monthly cashflow and spending patterns
- switch between `Viewer` and `Admin` roles on the frontend
- use a dark/light theme toggle

The app is intentionally built with mock data and local state because the assignment does not require backend integration. The goal was to create a polished, intuitive, and responsive interface that demonstrates frontend thinking, component structure, and attention to UI detail.

## Screenshots

### Dashboard Overview
<img src="./public/dashboard-overview1.png" width="700" />
<img src="./public/dashboard-overview2.png" width="700" />
<img src="./public/dashboard-overview3.png" width="700" />

### Transactions View
<img src="./public/transactions-view.png" width="700" />

### Mobile View
<p>
  <img src="./public/mobileview1.jpeg" width="180" />
  <img src="./public/mobileview2.jpeg" width="180" />
  <img src="./public/mobileview3.jpeg" width="180" />
  <img src="./public/mobileview5.jpeg" width="180" />
</p>

## Approach

- `App.jsx` manages layout, role, theme, and navigation
- `useTransactions.js` handles state + local storage
- `Dashboard.jsx` computes insights
- Charts are modular components
- Transactions logic is isolated

## Features

### Dashboard Overview
- Summary cards
- Cashflow chart
- Expense pie chart

### Transactions
- Search, filter, sort
- CRUD (Admin only)

### Role-Based UI
- Viewer → read-only
- Admin → full access

### Insights
- Highest spend category
- Monthly trends
- Avg category spend

### UI/UX
- Responsive design
- Dark/light mode
- Animations

## Tech Stack

- React
- Vite
- JavaScript (JSX)
- CSS

## Folder Structure

```text
src/
  assets/
  components/
  data/
  hooks/
  pages/
  utils/
```
# ==============================
# Setup Instructions
# ==============================

```git clone https://github.com/Sanst150505/Financial_dashboard.git
cd Financial_dashboard
npm install
npm run dev
npm run build
```

# ==============================
# Notes and Assumptions
# ==============================

# - Uses mock data
# - Frontend-only role switching
# - INR currency formatting
# - Demo project (not production)

# ==============================
# Possible Improvements
# ==============================

# - Add backend (API persistence)
# - Export CSV/JSON
# - Advanced analytics
# - Toast notifications
# - Unit testing

# ==============================
# Why This Meets the Assignment
# ==============================

# Covers:
# - Dashboard
# - Transactions
# - Role-based UI
# - Insights
# - State management
# - Responsive design

# Extras:
# - Dark/light theme
# - Local storage
# - Smooth UI transitions