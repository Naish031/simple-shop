# 🚀 AWS Deployment Guide: Next.js + OpenNext + SST

## 📋 Prerequisites

### 1. AWS Account Setup

- [ ] Create AWS account at https://aws.amazon.com/
- [ ] Set up IAM user with deployment permissions
- [ ] Get Access Key ID and Secret Access Key

### 2. Environment Variables

- [ ] MongoDB connection string
- [ ] Google OAuth credentials
- [ ] NextAuth secret

## 🔧 Setup Steps

### Step 1: Install Dependencies

```bash
npm install @serverless-stack/resources @aws-sdk/client-s3 @aws-sdk/client-cloudfront
npm install -g sst
```

### Step 2: Configure AWS Credentials

Create `aws-credentials.env` file:

```bash
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
```

### Step 3: Update Environment Variables

1. Copy `production.env` to `.env.production.local`
2. Fill in your actual values:
   - `NEXTAUTH_SECRET`: Generate a random string
   - `MONGODB_URI`: Your MongoDB connection string
   - `AUTH_GOOGLE_ID`: Google OAuth client ID
   - `AUTH_GOOGLE_SECRET`: Google OAuth client secret
   - `NEXTAUTH_URL`: Will be your AWS domain

## 🚀 Deployment Commands

### First Deployment

```bash
# Set AWS credentials
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=us-east-1

# Deploy to dev stage
npm run deploy

# Deploy to production
npm run deploy:prod
```

### Subsequent Deployments

```bash
npm run deploy
```

## 🔍 What Happens During Deployment

1. **SST Builds**: Creates CloudFormation templates
2. **OpenNext Builds**: Optimizes Next.js for serverless
3. **AWS Resources Created**:
   - Lambda functions for API routes
   - S3 bucket for static assets
   - CloudFront for CDN
   - API Gateway for routing
   - IAM roles and policies

## 📍 Finding Your Deployed App

### After Deployment

Look for output like:

```
✅  simple-shop-Web
   URL: https://abc123.cloudfront.net
   API: https://xyz789.execute-api.us-east-1.amazonaws.com
```

### SST Console

```bash
npm run console
```

This opens AWS console with your resources highlighted.

## 🧪 Testing Your Deployment

1. **Visit the URL** from deployment output
2. **Test Authentication**: Try logging in
3. **Test API Routes**: Check inventory endpoints
4. **Check Logs**: Use SST console or AWS CloudWatch

## 🗑️ Cleanup

### Remove Resources

```bash
npm run remove
```

### Remove Production Resources

```bash
sst remove --stage production
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Errors**:

   ```bash
   npm run build
   # Fix any build errors before deploying
   ```

2. **Permission Errors**:

   - Check IAM user permissions
   - Ensure `AdministratorAccess` policy is attached

3. **Environment Variables**:

   - Verify all required vars are set
   - Check SST config includes all vars

4. **MongoDB Connection**:
   - Ensure MongoDB allows connections from AWS IPs
   - Check connection string format

### Debug Commands

```bash
# Check SST status
sst list

# View logs
sst logs

# Open console
npm run console
```

## 📚 AWS Console Paths

### Key Services to Monitor

- **CloudFormation**: Stacks and resources
- **Lambda**: Serverless functions
- **S3**: Static assets storage
- **CloudFront**: CDN distribution
- **API Gateway**: API endpoints
- **IAM**: Roles and policies

### Finding Resources

1. Go to AWS Console
2. Use SST console: `npm run console`
3. Look for resources with prefix: `simple-shop-Web-*`

## 💡 Best Practices

1. **Stages**: Use different stages for dev/prod
2. **Environment Variables**: Never commit secrets
3. **Monitoring**: Set up CloudWatch alarms
4. **Backup**: Enable MongoDB backups
5. **Security**: Use least privilege IAM policies

## 🆘 Getting Help

- **SST Documentation**: https://docs.sst.dev/
- **OpenNext Documentation**: https://open-next.js.org/
- **AWS Documentation**: https://docs.aws.amazon.com/
- **Community**: SST Discord server

## 🎯 Next Steps After Deployment

1. **Set up custom domain** (optional)
2. **Configure monitoring and alerts**
3. **Set up CI/CD pipeline**
4. **Performance optimization**
5. **Security hardening**
