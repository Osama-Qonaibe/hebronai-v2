\# 🚀 HebronAI v2 - Production Deployment Guide



\## 📋 Pre-Deployment Checklist



\### cPanel/VPS Setup

\- \[ ] PostgreSQL database created

\- \[ ] Database user created with full privileges

\- \[ ] Domain configured in cPanel

\- \[ ] SSL certificate installed (AutoSSL/Let's Encrypt)

\- \[ ] Node.js 20.x available

\- \[ ] SSH access enabled

\- \[ ] PM2 will be installed via SSH



\### Cloudflare R2 Setup

\- \[ ] R2 bucket created: hebronai-uploads

\- \[ ] R2 API tokens generated

\- \[ ] Custom domain configured for R2 (optional)



\### Environment Variables

\- \[ ] `.env.production` updated with actual values

\- \[ ] DATABASE\_URL configured (localhost:5432)

\- \[ ] BETTER\_AUTH\_URL set to production domain

\- \[ ] BETTER\_AUTH\_SECRET generated (32+ chars)

\- \[ ] All AI API keys added (OpenAI, Anthropic, Google, etc)

\- \[ ] Cloudflare R2 credentials added

\- \[ ] Payment configs added (if needed)



---



\## 📦 Upload to Server



\### Via FTP/cPanel File Manager

1\. Compress: `hebronai-v2.zip`

2\. Upload to: `/home/USERNAME/public\_html/`

3\. Extract files



---



\## 🔧 Server Setup Commands



\### 1. SSH into Server

```bash

ssh root@your-server-ip

\# Or: ssh username@your-server-ip



