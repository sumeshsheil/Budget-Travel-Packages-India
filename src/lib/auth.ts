import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    role: "admin" | "agent" | "customer";
    mustChangePassword: boolean;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "admin" | "agent" | "customer";
      mustChangePassword: boolean;
    };
  }
}

declare module "next-auth" {
  interface JWT {
    role: "admin" | "agent" | "customer";
    userId: string;
    mustChangePassword: boolean;
  }
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Validate input with Zod
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        // 2. Connect to database
        await connectDB();

        // 3. Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          return null;
        }

        // 4. Check user is active
        if (user.status !== "active") {
          return null;
        }

        // 5. Customers must have activated their account
        if (user.role === "customer" && !user.isActivated) {
          return null;
        }

        // 6. Compare password
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        // 7. Return user object
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60, // 365 days
  },
  // NOTE: Do NOT set pages.signIn here.
  // The proxy middleware handles admin login redirects on the portals domain,
  // and customer login is handled separately at /dashboard/login.
  // Setting a global signIn page to /admin/login breaks the public domain
  // because proxy.ts blocks /admin/* routes there (returns 404).
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id!;
        token.mustChangePassword = user.mustChangePassword;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as "admin" | "agent" | "customer";
        session.user.mustChangePassword = token.mustChangePassword as boolean;
      }
      return session;
    },
  },
});
