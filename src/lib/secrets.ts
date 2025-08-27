import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export async function getSecretValue(secretName: string) {
  try {
    const client = new SecretsManagerClient({});
    const cmd = new GetSecretValueCommand({ SecretId: secretName });
    const res = await client.send(cmd);

    if (res.SecretString) return res.SecretString;

    if (res.SecretBinary) {
      // If secret is binary, decode it
      return Buffer.from(res.SecretBinary).toString("utf8");
    }

    return null;
  } catch (err) {
    console.error("Error reading secret:", err);
    return null;
  }
}
