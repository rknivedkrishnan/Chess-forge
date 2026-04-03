import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // adapter: PrismaAdapter(prisma) as any, // Commented out to avoid connection error without DB
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock",
    }),
    Credentials({
      name: "Sign in",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // const user = await prisma.user.findUnique({ ... })

        if (credentials.email === "test@example.com" && credentials.password === "password") {
             return { id: "1", name: "Test User", email: "test@example.com", role: "user" };
        }
        
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role as string;
      }
      return token;
    },
  },
});
