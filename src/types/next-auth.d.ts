import "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    email?: string;
    username?: string;
  }
  interface Session {
    user?: User & DefaultSession["user"];
  }
  interface JWT {
    _id?: string;
    email?: string;
    username?: string;
  }
}
