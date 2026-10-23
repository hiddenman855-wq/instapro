# InstaGrow - Instagram Growth Platform

Automated Instagram Growth platform with real-time proportional pricing in Indian Rupees (INR ₹), free trial services, instant UPI QR code generator, 12-digit UTR reconciliation, and multi-tier Super Admin controls.

---

## 🎁 Features

- **Free Services & Trials**:
  - Super Admin can create 100% Free Trial services (`₹0.00`) or toggle existing packages to free.
  - Customers can claim free trial services instantly with zero wallet balance required.
  - Dedicated "🎁 Free Trial" category tab in the customer dashboard and catalog.
- **Proportional Live Pricing (INR ₹)**:
  - Exact proportional rates: 500 followers at ₹29/1k = ₹14.50.
  - Live formula breakdown and real-time calculation.
- **UPI QR Code & 12-Digit UTR System**:
  - Dynamic QR codes generated for exact order amounts or wallet top-ups.
  - UTR submission queue for rapid Super Admin verification and auto-credit.
- **Visual Instagram Public Setting Guide**:
  - Interactive smartphone mockup demonstrating how to set accounts to Public.
- **Multi-Tier Admin Hierarchy**:
  - Super Admin (`hiddenman855@gmail.com`): Full controls over UPI settings, rate adjustments, free service creation, admin management, and payments.
  - Normal Admins: Fulfillment queue tracking and customer support ticket replies.

---

## 🚀 Deploying to Vercel

The project is fully configured and ready for 1-click deployment on [Vercel](https://vercel.com).

### Method 1: Deploy via GitHub / GitLab / Bitbucket
1. Push this repository to your GitHub account.
2. In the [Vercel Dashboard](https://vercel.com/new), click **"Add New..."** > **"Project"**.
3. Select your repository.
4. Vercel automatically detects the framework presets from `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. *(Optional)* Add any custom environment variables from `.env.example` if overriding Firebase credentials.
6. Click **Deploy**. Your site will be live on `*.vercel.app` in under 60 seconds!

### Method 2: Deploy via Vercel CLI
```bash
# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Deploy directly
vercel --prod
```

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```
