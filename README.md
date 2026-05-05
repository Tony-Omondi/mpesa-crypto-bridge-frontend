# 📱 NiToken — M-Pesa to Crypto Bridge (React Native)

The mobile application for the **NiToken ($NIT)** ecosystem. Built with **React Native (Expo)**, it provides a seamless interface for a non-custodial wallet that bridges **M-Pesa** mobile money with the **Arbitrum Sepolia Blockchain**.

Users manage digital assets, converting Kenyan Shillings (KES) to stablecoins ($NIT) and back — with a simple "Cash-in, Cash-out" experience designed for everyday users like mama mboga.

---

## ⚡ Key Features

| Feature | Description |
| :--- | :--- |
| 🔐 **Seedless Wallet** | Login with Email, Google, or Apple via Privy. No seed phrases. No crypto knowledge needed. |
| 🔑 **Transaction PIN** | M-Pesa-style 4-digit PIN required before every outgoing payment. Even a stolen JWT can't move funds. |
| 💰 **Real-Time Dashboard** | Live balances for **$NIT** (Stablecoin) and **ETH** (Gas) on Arbitrum Sepolia. |
| 📲 **M-Pesa Deposits** | Enter an amount in KES, receive an STK Push prompt, instantly receive minted $NIT tokens. |
| 🏦 **M-Pesa Withdrawals** | Cash out crypto — burns $NIT on-chain and triggers an instant M-Pesa B2C transfer. |
| 💸 **P2P Transfers** | Send $NIT to any wallet address on the blockchain. |
| 📡 **App-Less Payments** | Request payments from non-users via a shareable link — triggers STK Push without the app. |

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React Native (Expo SDK 53) |
| **Navigation** | Expo Router (file-based routing) |
| **State Management** | Redux Toolkit + Redux Persist |
| **Auth** | Privy (`@privy-io/expo`) — seedless embedded wallets |
| **Blockchain** | ethers.js v6 + Arbitrum Sepolia |
| **API Client** | Axios + Fetch |
| **Styling** | React Native StyleSheet |
| **Animations** | Lottie React Native |
| **Secure Storage** | Expo SecureStore |
| **Backend** | Django REST Framework (separate repo) |

---

## 🔐 Security Architecture

```
Login layer       →  Privy (Email / Google / Apple)
                     MPC key splitting — no single party holds the full key
Transaction layer →  Django JWT required for all API calls
Payment layer     →  Transaction PIN (4-digit) required before every send
Recovery layer    →  Privy social recovery — no seed phrase to lose
```

This mirrors M-Pesa's security model: login gets you in, but the PIN protects your money.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or later
- **Android device** with USB debugging enabled (for dev build)
- **ADB** in your system PATH
- **Java 17 or 21** (Gradle requirement — not Java 26)
- The **[NiToken Backend](https://github.com/yourusername/nitoken-backend)** running locally or via Ngrok

---

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/mpesa-crypto-bridge-frontend.git
cd mpesa-crypto-bridge-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.example .env
```

Fill in your `.env`:
```bash
# Privy — get from dashboard.privy.io → Settings → API Keys
EXPO_PUBLIC_PRIVY_APP_ID=cmor9ihsi00io0dk26hdv9cji
EXPO_PUBLIC_PRIVY_CLIENT_ID=client-xxxxxxxxxxxxxxxxx

# Backend — your local server or ngrok URL
EXPO_PUBLIC_API_URL=https://your-ngrok-url.ngrok-free.app
```

---

### Running the App

> ⚠️ This app uses native modules (Privy, NitroModules) and **cannot run in Expo Go**.
> You must use a development build.

**First time setup — build the dev APK:**
```bash
# Connect your Android phone via USB with USB debugging ON
adb devices  # verify your phone appears

npx expo run:android
# Takes 5–10 minutes first time — installs the APK on your phone automatically
```

**After the first build — just start Metro:**
```bash
npx expo start --dev-client --clear
# Scan the QR code with your installed dev build app
```

---

### Docker (Alternative — runs Metro bundler in a container)

If you want the dev server containerized so any machine just needs Docker:

```bash
# Copy env and fill in values
cp .env.example .env

# Start Metro bundler in Docker
docker compose up --build
```

Your phone connects to the containerized Metro server via Expo tunnel. No Node.js installation needed on the host machine.

---

## 📁 Project Structure

```
app/
├── (auth)/
│   ├── welcome.tsx          # Entry screen — Privy login
│   ├── setPin.tsx           # Transaction PIN setup (first login)
│   └── restoreWithMnemonic  # Legacy seed phrase restore
├── (loading)/
│   ├── privyAuth.tsx        # Privy → Django JWT bridge
│   └── createWallet.tsx     # Wallet creation loading screen
├── (tabs)/
│   ├── home.tsx             # Dashboard — balances + actions
│   ├── profile.tsx          # Settings + logout
│   └── ...
└── _layout.tsx              # Root layout — PrivyProvider + Redux

src/
├── store/                   # Redux store + wallet slice
├── config.ts                # All API endpoint URLs
├── validation.ts            # Input validation helpers
└── utils/
    └── secureStorage.ts     # Expo SecureStore wrapper
```

---

## 🌍 Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `EXPO_PUBLIC_PRIVY_APP_ID` | ✅ | Your Privy App ID from dashboard.privy.io |
| `EXPO_PUBLIC_PRIVY_CLIENT_ID` | ✅ | Your Privy Client ID from dashboard.privy.io |
| `EXPO_PUBLIC_API_URL` | ✅ | Backend base URL (ngrok or production) |

> All frontend env vars **must** start with `EXPO_PUBLIC_` — Expo strips anything else at build time.
> The Privy **App Secret** belongs in the backend `.env` only — never in this file.

---

## 🔗 Related Repositories

- **Backend**: [nitoken-backend](https://github.com/yourusername/nitoken-backend) — Django REST API, M-Pesa integration, smart contract interaction

---

## 📄 License

Private — All rights reserved.