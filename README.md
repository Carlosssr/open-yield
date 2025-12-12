<h1>OpenYield</h1>

<h2>Introduction</h2>
<p>
  <strong>OpenYield</strong> is a non-custodial savings and borrowing dashboard built on the
  <strong>Aave Protocol (v4)</strong>. It allows users to supply assets and earn interest,
  or borrow against their crypto collateral, all from a single unified interface.
</p>

<p>
  The project is designed as a <strong>developer portfolio piece</strong>, showcasing a
  full-stack dApp using Aave’s latest tools. OpenYield supports multiple Ethereum
  Layer-1 and Layer-2 networks, letting users seamlessly manage their positions across
  <strong>Ethereum, Arbitrum, Optimism, and Base</strong>.
</p>

<p>
  All operations are fully non-custodial — users remain in control of their funds via
  their own Web3 wallet.
</p>

<hr />

<h2>Features</h2>

<h3>Supply &amp; Earn</h3>
<p>
  Deposit popular assets such as <strong>USDC, DAI, ETH, and WBTC</strong> into Aave v4
  markets to earn variable interest. View accrued interest in real time and withdraw
  your assets at any time.
</p>

<h3>Borrow Against Collateral</h3>
<p>
  Borrow supported assets using your supplied assets as collateral. OpenYield provides
  a guided borrowing flow that clearly shows your borrowing power and current interest
  rates.
</p>

<h3>Multi-Chain Support</h3>
<p>
  Seamlessly switch between networks including <strong>Ethereum, Arbitrum, Optimism,
  and Base</strong>. The UI and data automatically update to reflect the selected
  network’s markets and your positions on that chain.
</p>

<h3>Real-Time Health Factor</h3>
<p>
  A visual indicator of your account’s health factor (borrow risk). The dashboard updates
  in real time and provides alerts if your health factor approaches risky levels, helping
  you avoid liquidations.
</p>

<h3>Permit One-Click Deposits</h3>
<p>
  For supported tokens, OpenYield uses <strong>EIP-2612 permit signatures</strong> to
  enable one-click deposits and repayments, removing the need for separate approval
  transactions.
</p>

<h3>Responsive UI</h3>
<p>
  Built with <strong>TailwindCSS</strong>, OpenYield is fully responsive and optimized for
  mobile and desktop use. The interface supports both dark and light modes for improved
  usability.
</p>

<h3>Wallet Connection</h3>
<p>
  Connect via <strong>MetaMask</strong> or any WalletConnect-compatible wallet using
  <strong>wagmi</strong>. Transactions are signed directly from your wallet — no accounts
  or logins required.
</p>

<h3>Safe Testnet Mode</h3>
<p>
  OpenYield can run on testnet configurations (such as Ethereum Goerli or other Aave test
  deployments), allowing developers to experiment without risking real funds.
</p>

<hr />

<h2>Tech Stack</h2>

<ul>
  <li><strong>Frontend:</strong> React + TypeScript, using modern React tooling (Vite or CRA).</li>
  <li><strong>Aave Protocol v4:</strong> Core lending and borrowing logic via Aave v4 smart contracts.</li>
  <li><strong>AaveKit React SDK:</strong> Type-safe React hooks for market data and transactions.</li>
  <li><strong>Blockchain Connectivity:</strong> wagmi + viem for wallet connections, network switching, and RPC calls.</li>
  <li><strong>UI Styling:</strong> TailwindCSS with an Aave-inspired custom theme.</li>
  <li><strong>State Management:</strong> React Context and hooks; global state handled via wagmi and AaveProvider.</li>
  <li><strong>Build &amp; Tooling:</strong> TypeScript, Vite (or CRA), ESLint, Prettier, and optional Jest / React Testing Library.</li>
</ul>

<hr />

<h2>Setup &amp; Installation</h2>

<h3>Clone the Repository</h3>
<pre><code>git clone https://github.com/Carlosssr/open-yield.git</code></pre>

<h3>Install Dependencies</h3>
<pre><code>cd open-yield
npm install</code></pre>

<p>
  This installs React, AaveKit, wagmi, TailwindCSS, and all required dependencies.
</p>

<h3>Configure Environment</h3>
<p>
  By default, OpenYield connects to Ethereum mainnet and other production networks.
  Optionally, create a <code>.env</code> file to configure RPC URLs or API keys
  (Alchemy, Infura, etc.).
</p>

<pre><code>VITE_ETH_RPC_URL=
VITE_ARB_RPC_URL=
VITE_OP_RPC_URL=
VITE_BASE_RPC_URL=</code></pre>

<h3>Run the App</h3>
<pre><code>npm run dev</code></pre>

<p>
  The development server will start at <code>http://localhost:3000</code>. Connect a
  Web3 wallet to begin interacting with the app.
</p>

<h3>Build for Production</h3>
<pre><code>npm run build</code></pre>

<p>
  The production build can be deployed to services such as <strong>Vercel</strong>,
  <strong>Netlify</strong>, or <strong>GitHub Pages</strong>.
</p>
