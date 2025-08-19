// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "simple-shop",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("Web", {
      // Expose your env vars here
      environment: {
        AUTH_SECRET:
          $app.stage === "production"
            ? process.env.AUTH_SECRET!
            : "devsecret",
        MONGODB_URI: process.env.MONGODB_URI!,
        AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID!,
        AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET!,
      },
      // Optional: add your custom domain
      // domain: "yourdomain.com",
    });
  },
});
