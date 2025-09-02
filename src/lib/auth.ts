import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// Debug: Log environment variables (只在开发环境)
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Environment Variables Debug:');
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...` : 'NOT SET');
  console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? `${process.env.GOOGLE_CLIENT_SECRET.substring(0, 10)}...` : 'NOT SET');
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET');
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // 绕过 discovery，直接指定 Google OAuth 端点
      wellKnown: undefined,
      authorization: {
        url: "https://accounts.google.com/o/oauth2/v2/auth",
        params: {
          scope: "openid email profile",
          access_type: "offline",
          prompt: "consent",
        },
      },
      token: {
        url: "https://www.googleapis.com/oauth2/v4/token",
        params: {},
      },
      userinfo: {
        url: "https://www.googleapis.com/oauth2/v3/userinfo", 
        params: {},
      },
      httpOptions: {
        timeout: 30000, // 增加到30秒
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log('✅ Sign in successful:', { user: user.email, account: account?.provider });
    },
  },
  debug: process.env.NODE_ENV === 'development',
};