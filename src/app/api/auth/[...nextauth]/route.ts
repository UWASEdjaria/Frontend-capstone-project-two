
// the brain of  entire authentication system

import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize called with:", { email: credentials?.email });

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          // Test database connection
          await prisma.$connect();
          
          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log("User found:", user ? "Yes" : "No");

          if (!user) {
            return null;
          }

          // Check password
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          console.log("Password valid:", isValidPassword);

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
  },
//When a user is NOT logged in and tries to visit a protected page,
//redirect them to /lab2/login.
  pages: {
    signIn: "/lab2/login",
  },
//To make sure tokens can’t be forged or read by attackers.
//jwt:Store everything inside the user’s browser token
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
  },
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
