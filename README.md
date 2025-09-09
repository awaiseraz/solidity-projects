# Smart Contracts Suite: Token, Token Sale, and Vending Machine

This repository contains a set of Solidity smart contracts that demonstrate a **basic ERC-20 token**, a **token sale mechanism**, and a **vending machine simulation** on Ethereum.  
These contracts can be deployed individually or together to showcase a mini-ecosystem of token issuance, sale, and utility.

---

## 📜 Contracts Overview

### 1. Token (ERC-20 Inspired)
A custom ERC-20 style token implementation with mint, burn, and pause functionality.

- **Key Features:**
  - `name`, `symbol`, `decimals`, `totalSupply`
  - Standard ERC-20 functions: `transfer`, `approve`, `transferFrom`
  - **Owner-only controls:**
    - `mint(address, amount)` → Mint new tokens
    - `burn(amount)` → Burn your own tokens
    - `pause()` / `unpause()` → Pause or unpause all transfers
  - **Events:** `Transfer`, `Approval`, `Mint`, `Burn`, `Paused`, `Unpaused`

---

### 2. TokenSale
A crowdsale-style contract allowing users to buy tokens directly using ETH.

- **Key Features:**
  - `tokenPrice` (in wei) determines how many tokens per ETH
  - `buyTokens()` → Buy tokens by sending ETH
  - `withdraw()` → Owner withdraws collected ETH
  - `setTokenPrice(uint256)` → Owner updates the token price
  - `receive()` → Fallback function so users can buy tokens just by sending ETH
  - **Events:** `TokenPurchased`, `withdrawl`

- **Formula:**  
  ```text
  tokensToReceive = msg.value / tokenPrice
