# 📱 M-Pesa to Crypto Bridge Frontend (React Native)

This repository hosts the mobile application for the **NiToken ($NIT)** ecosystem. Built with **React Native (Expo)**, it provides a user-friendly interface for the non-custodial wallet that bridges **M-Pesa** mobile money with the **Arbitrum Sepolia Blockchain**.

Users can manage their digital assets, converting Kenyan Shillings (KES) to stablecoins ($NIT) and back with a seamless "Cash-in, Cash-out" experience.

---

## ⚡ Key Features

* **👛 Non-Custodial Wallet Creation**
    Generates secure Ethereum wallets locally. Users own their Private Keys and Mnemonic phrases.
    
* **💰 Real-Time Dashboard**
    Displays live balances for **$NIT** (Stablecoin) and **ETH** (Gas) on the Arbitrum Sepolia network.

* **📲 Instant Deposits (M-Pesa STK Push)**
    Users enter an amount in KES, receive an M-Pesa prompt on their phone, and instantly receive minted $NIT tokens upon payment.

* **🏦 Automated Withdrawals (B2C)**
    Users can cash out their crypto. The app burns $NIT tokens on the blockchain and triggers an instant M-Pesa transfer to their mobile number.

* **💸 P2P Transfers**
    Send $NIT tokens to any other wallet address on the blockchain securely using the user's private key.

* **🔐 Secure Signing**
    Transactions are authorized via the user's private key, ensuring funds cannot be moved without user consent.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | React Native (Expo SDK 50+) |
| **Navigation** | Expo Router (File-based routing) |
| **State Management** | Redux Toolkit |
| **API Client** | Axios |
| **Styling** | React Native StyleSheet |
| **Blockchain Data** | Fetched via Django Backend API |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18 or later)
* **Expo Go** app installed on your physical Android/iOS device.
* The **[Backend Server](https://github.com/yourusername/nitoken-backend)** must be running locally or via Ngrok.

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/mpesa-crypto-bridge-frontend.git](https://github.com/yourusername/mpesa-crypto-bridge-frontend.git)
   cd mpesa-crypto-bridge-frontend








# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
