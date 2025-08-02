import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/user.models";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
    credentials({
      id: "credentials",
      name: "credentials",
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

        if (!user.password) {
          throw new Error(
            "This account was created via Google. Please log in with Google."
          );
        }

        const isPasswordValid = await bcrypt.compare(
          credentials?.password as string,
          user.password
        );
        if (!isPasswordValid) throw new Error("Invalid password");

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: profile?.email });

        if (existingUser) {
          if (existingUser?.password) {
            throw new Error(
              "An account with this email already exists. Please sign in using your email and password."
            );
          }

          user.id = existingUser._id.toString();
          user.username = existingUser.username;
        } else {
          const newUser = await User.create({
            username: profile?.name || profile?.email?.split("@")[0],
            email: profile?.email,
            isVerified: true,
          });

          user.id = newUser._id.toString();
          user.username = newUser.username;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      console.log("JWT callback - user:", user);

      if (user) {
        token.id = user._id;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - token:", token);

      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.username as string;
        session.user.role = token.role as string;
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
    maxAge: 7 * 24 * 60 * 60, // for 1 day
  },

  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};
