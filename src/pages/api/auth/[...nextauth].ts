import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID || "",
      clientSecret: env.GITHUB_CLIENT_SECRET || "",
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
  secret: env.NEXTAUTH_SECRET || "",
  adapter: PrismaAdapter(prisma),
  debug: true,
  logger: {
    error(code, ...message) {
      console.error(code, message);
    },
    warn(code, ...message) {
      console.warn(code, message);
    },
    debug(code, ...message) {
      console.debug(code, message);
    },
  },
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

export default NextAuth(authOptions);
