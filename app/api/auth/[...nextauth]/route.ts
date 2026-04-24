import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongo } from "@/lib/mongodb";
import User from "@/models/User";

const { handlers } = NextAuth({
  ...authOptions,
  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email) return false;

        await connectMongo();

        const existingUser = await User.findOne({ email: user.email }).lean();

        if (!existingUser) {
          await User.create({
            name: user.name ?? "",
            email: user.email,
            image: user.image ?? "",
            createdAt: new Date(),
          });
        }

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return true; // still let them in even if DB save fails
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});

export const { GET, POST } = handlers;