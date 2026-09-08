import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const isValidUser =
          credentials.email === process.env.DEMO_EMAIL &&
          credentials.password === process.env.DEMO_PASSWORD;

        if (!isValidUser) {
          return null;
        }

        return {
          id: "demo-user",
          name: "John Doe",
          email: process.env.DEMO_EMAIL,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};