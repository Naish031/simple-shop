# 🚀 Quick Start: Deploy to AWS in 5 Minutes

## ⚡ Immediate Steps

### 1. Set Up AWS Credentials

```bash
# Copy your AWS credentials from aws-credentials.env
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=us-east-1
```

### 2. Update Environment Variables

```bash
# Run the setup script
./setup-env.sh

# Edit .env.production.local with your actual values
nano .env.production.local
```

### 3. Deploy!

```bash
# Deploy to AWS
./deploy.sh
```

## 📋 What You Need

- [ ] AWS Access Key ID
- [ ] AWS Secret Access Key
- [ ] MongoDB connection string
- [ ] Google OAuth credentials
- [ ] NextAuth secret (generate with: `openssl rand -base64 32`)

## 🔍 After Deployment

Look for output like:

```
✅  simple-shop-Web
   URL: https://abc123.cloudfront.net
```

Visit that URL to test your app!

## 🆘 Need Help?

- **Full Guide**: `DEPLOYMENT_GUIDE.md`
- **SST Console**: `npm run console`
- **Remove Resources**: `npm run remove`
