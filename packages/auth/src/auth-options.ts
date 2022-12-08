import { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { prisma } from "@vmix/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      profile(profile) {
        console.log("profile", profile);
        return {
          id: String(profile.id),
          name: profile.name || profile.login,
          username: profile.login,
          email: profile.email,
          // image: profile.avatar_url,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "",
  callbacks: {
    session: ({ session, user }) => {
      console.log("session", session);
      console.log("user", user);
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          username: user.username,
        },
      };
    },
  },
};
