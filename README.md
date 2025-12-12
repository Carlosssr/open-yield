README
Introduction

OpenYield is a non-custodial savings and borrowing dashboard built on the Aave Protocol (v4). It allows users to supply assets and earn interest, or borrow against their crypto collateral, all from a single unified interface. The project is designed as a developer portfolio piece, showcasing a full-stack dApp using Aave’s latest tools. OpenYield supports multiple Ethereum Layer-1 and Layer-2 networks, letting users seamlessly manage their positions across Ethereum, Arbitrum, Optimism, and Base. All operations are non-custodial – users remain in control of their funds via their own Web3 wallet.

Features

Supply & Earn: Deposit popular assets (e.g., USDC, DAI, ETH, WBTC) into Aave v4 markets to earn variable interest. View accrued interest and withdraw your assets anytime.

Borrow Against Collateral: Borrow assets by using your supplied assets as collateral. OpenYield provides a guided borrow flow, showing your borrowing power and current interest rates.

Multi-Chain Support: Easily switch between networks like Ethereum, Arbitrum, Optimism, and Base. The UI and data update to reflect the selected network’s markets and your positions on that chain.

Real-Time Health Factor: Visual indicator of your account’s health factor (borrow risk). The dashboard updates your health factor in real time and provides alerts if it falls to risky levels, helping you avoid liquidations.

Permit One-Click Deposits: For supported tokens, OpenYield uses permit (EIP-2612) signatures to let you deposit or repay in one step, without requiring a separate token approval transaction
aave.com
.

Responsive UI: Built with TailwindCSS, the app is mobile-friendly and adapts to different screen sizes. The design emphasizes clarity, with dark and light mode support for comfortable viewing.

Wallet Connection: Connect with MetaMask or any WalletConnect-compatible wallet via wagmi. Your wallet is used to sign transactions directly – no accounts or logins needed.

Safe Testnet Mode: OpenYield can run on testnet configurations (such as Ethereum Goerli or other Aave test deployments) for development and testing purposes, so you can experiment without risking real funds.

Tech Stack

Frontend: React + TypeScript. The project was bootstrapped with a modern React toolkit (e.g., Vite or Create React App) and uses functional components with hooks.

Aave Protocol v4: All lending and borrowing functionality is powered by Aave v4 smart contracts. Business logic is handled via AaveKit React hooks, which abstract direct contract interactions.

AaveKit React SDK: The app leverages the official AaveKit React v4 library
aave.com
 for a seamless integration. This provides type-safe React hooks for fetching data (markets, user positions) and performing transactions (supply, borrow, etc.)
aave.com
.

Blockchain Connectivity: Uses wagmi (with viem under the hood) for wallet connections and signing. Wagmi’s React hooks manage the Ethereum provider, network switching, and account data, while viem provides fast, reliable JSON-RPC calls.

UI Styling: TailwindCSS is used for rapid UI development and consistent design. Components are styled with utility classes, and a custom Tailwind theme provides Aave-inspired colors (e.g., leveraging blues/purples for brand feel and red/yellow/green for health factor statuses).

State Management: React’s built-in state and context (no heavy state libraries needed). AaveProvider from AaveKit wraps the app to provide context. Global app state (selected network, connected account) is largely handled by wagmi and React Context.

Build & Tooling: TypeScript for type safety. Vite (or CRA) for development server and building. Eslint and Prettier for code quality, and possibly Jest or React Testing Library for basic testing of components and hooks.

Setup & Installation

Clone the Repository: git clone https://github.com/yourusername/openyield.git
(Replace with actual repo link when available.)

Install Dependencies: cd openyield && npm install
This will install React, AaveKit, wagmi, Tailwind, and other dependencies.

Configure Environment: By default, OpenYield connects to Ethereum mainnet and other production networks. You can create a .env file to set RPC URLs or API keys (for providers like Alchemy/Infura) if needed. For example, you might set VITE_ETH_RPC_URL, VITE_ARB_RPC_URL, etc., or use default public RPC endpoints.

Run the App: npm run dev (for Vite) or npm start (for CRA). This will start the development server at http://localhost:3000.
The app will prompt you to connect a wallet. For testing on a testnet, connect a wallet configured for that test network. Ensure the Aave v4 deployment exists on that network (for instance, if testing on Goerli, you may need Aave’s test deployment addresses).

Build for Production: npm run build will bundle the app for production. You can then deploy the static files to a hosting service of your choice (e.g., Vercel, Netlify, GitHub Pages).