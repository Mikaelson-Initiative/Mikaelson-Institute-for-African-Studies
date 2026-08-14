import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { verifyLoginCode } from "@/lib/otp";

const NINETY_DAYS_IN_SECONDS = 60 * 60 * 24 * 90;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // A Credentials provider forces JWT sessions (Auth.js throws
  // UnsupportedStrategy otherwise) — database sessions aren't supported for
  // Credentials sign-in. maxAge is long deliberately: this cohort site has
  // no payment/PII behind login, and the Resend free tier's 100 emails/day
  // cap means re-sending a code on every visit isn't affordable, so staying
  // signed in for months trades a bit of session hygiene for real cost
  // savings — an explicit, agreed tradeoff, not an oversight.
  session: { strategy: "jwt", maxAge: NINETY_DAYS_IN_SECONDS },
  providers: [
    Google,
    Credentials({
      id: "email-code",
      name: "Email code",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const code = credentials?.code;
        if (typeof email !== "string" || typeof code !== "string") return null;

        const valid = await verifyLoginCode(email, code);
        if (!valid) return null;

        return prisma.user.upsert({
          where: { email },
          update: {},
          create: { email },
        });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
        session.user.isAdmin = isAdminEmail(session.user.email);
      }
      return session;
    },
  },
});
