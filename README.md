# 🌿 GreenDao Prototype

**GreenDao** is a prototype of an eco-conscious decentralized application that merges environmental awareness with blockchain-powered tools. Designed for developers, crypto users, and sustainability advocates, it offers a playful yet impactful way to track and reduce carbon impact while interacting with real market data.

---

## 🚀 Key Features

### 🔁 Real-Time Carbon Tracker
Fetches live prices from **OKX DEX API** and calculates the carbon footprint of transactions. Enables users to make greener crypto decisions.

### 🧠 Multi-Personality Chatbot
Powered by **Sensay AI**, this chat interface lets you interact with:
- **Eco-Coach**: Sustainability advice.
- **Crypto-Analyst**: Eco-friendly crypto insights.
- **Punk-Hacker**: Raw and rebellious takes on blockchain ethics.

### ♻️ EcoTradingHub
Combines **OKX market data** and **Sensay AI logic** to provide carbon-aware trading signals — helping users trade responsibly.

### 📊 Dynamic Carbon Tracking
Visual tracker displays estimated carbon savings based on user activity and AI recommendations.

### 🗳️ Community DAO Voting
Let your voice be heard! Users can vote on green initiatives and feature rollouts.

---

## 🔌 APIs Used

| API         | Purpose                                      |
|-------------|----------------------------------------------|
| **OKX DEX** | Fetch live market data for crypto tokens     |
| **Sensay AI** | Generate dynamic AI chatbot personalities  |

---

## 🧱 Tech Stack

- **Frontend**: React + TypeScript
- **UI**: Tailwind CSS + ShadCN
- **Build Tool**: Vite
- **State Management**: React Hooks
- **API Integration**: OKX DEX, Sensay AI (fallback included)

---

## 🧪 Prototype Links

- 🌐 Live: [greendao.netlify.app](https://greendao.netlify.app)
- 🎥 Demo: [YouTube](https://youtu.be/qoO9adtWWJs)
- 💻 GitHub Repo: [GreenDao-Lite](https://github.com/GreenDaoAI/GreenDao-Lite.git)
- 📦 DoraHacks Submission: [BUIDL #26463](https://dorahacks.io/buidl/26463)

---

## 🔧 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Bun](https://bun.sh/) (optional package manager)

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/GreenDaoAI/GreenDao-Lite.git
cd GreenDao-Lite

# Install dependencies
npm install  # or bun install

# Run the development server
npm run dev  # or bun dev

# Open your browser at:
http://localhost:5173


---
## Project structure

├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Route-based views
│   ├── lib/            # Utility functions
│   ├── App.tsx         # Main app container
│   └── main.tsx        # App entry point
├── index.html          # HTML template
├── package.json        # Project metadata
└── tailwind.config.ts  # Tailwind configuration
---
