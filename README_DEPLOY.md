# Deployment Guide: Hostinger Business Shared Hosting

This project is optimized for deployment on Hostinger's shared hosting environment using the `standalone` build output.

## 📋 Prerequisites

1.  **Hostinger Plan**: Business Shared Hosting (or higher) with Node.js support.
2.  **External Database**: Ensure your MongoDB Atlas cluster allows connections from all IPs (`0.0.0.0/0`) or specific Hostinger server IPs.

## 🚀 Deployment Steps

### 1. Build the Project Locally

Run the build command on your local machine:

```bash
npm run build
```

This will create a `.next/standalone` folder.

### 2. Prepare for Upload

Navigate to `.next/standalone`. You need to zip the contents of this folder, **including** the `.next` folder itself (to preserve static assets).

- Copy `public` folder to `.next/standalone/public`
- Copy `.next/static` folder to `.next/standalone/.next/static`

Zip the entire contents of `.next/standalone`.

### 3. Upload to Hostinger

1.  Log in to your **Hostinger hPanel**.
2.  Go to **Files** -> **File Manager**.
3.  Upload the zip file to your domain's directory (usually `public_html/travel`).
4.  Extract the zip file.

### 4. Configure Node.js on Hostinger

1.  In hPanel, search for **Node.js**.
2.  Select the app directory where you extracted the files.
3.  Choose **Node.js 18 or 20**.
4.  Set the **Application startup file** to `server.js`.
5.  Click **Install** to install any missing dependencies (though standalone usually includes them).

### 5. Set Environment Variables

In the Node.js configuration section on Hostinger, add your environment variables from `.env.local`:

- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (Set this to your production URL, e.g., `https://yourdomain.com`)
- `RESEND_API_KEY`
- `MC_CUSTOMER_ID`
- `MC_API_KEY`
- `MC_SENDER_ID`

### 6. Start the App

Click **Start App** in the Hostinger Node.js dashboard.

---

## 💡 Pro Tips

- **Port**: Hostinger usually handles the port mapping automatically. Your `server.js` listens on port 3000 by default.
- **HTTPS**: Use Hostinger's free SSL to ensure `NEXTAUTH_URL` uses `https`.
- **Logs**: If the app fails to start, check the `logs` folder in your file manager.
