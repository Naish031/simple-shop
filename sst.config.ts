// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "simple-shop",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      region: "us-east-1",
    };
  },
  async run() {
    new sst.aws.Nextjs("Web", {
      // Expose your env vars here
      environment: {
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
        MONGODB_URI: process.env.MONGODB_URI!,
        AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID!,
        AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET!,
        NEXT_PUBLIC_LOW_STOCK_THRESHOLD:
          process.env.NEXT_PUBLIC_LOW_STOCK_THRESHOLD || "5",
      },
      // Optional: add your custom domain
      // domain: "yourdomain.com",
      // Use OpenNext for better performance
    });

    // NOTE: If you want the deployed app to read secrets from AWS Secrets Manager,
    // grant the function permission in the AWS Console or by editing the SST
    // configuration to attach the `secretsmanager:GetSecretValue` permission to
    // the deployed role. For a quick test you can grant AdministratorAccess to
    // your IAM user (not recommended for production).
  },
});
