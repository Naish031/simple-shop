import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/db/index";
import User from "@/models/user.models";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
    credentials({
      id: "Credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({
          email: credentials?.email,
        }).select("+password");

        if (!user) throw new Error("No user found");

        const isPasswordValid = await bcrypt.compare(
          credentials?.password as string,
          user.password
        );
        if (!isPasswordValid) throw new Error("Invalid password");

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT callback - user:", user);

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - token:", token);

      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.username as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
  },
};
