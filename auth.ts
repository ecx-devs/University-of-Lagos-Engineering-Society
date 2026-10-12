import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if (user.image) token.picture = user.image;
        if (user.name) token.name = user.name;
        if (user.email) token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        if (token.picture) session.user.image = token.picture as string;
        if (token.name) session.user.name = token.name as string;
        if (token.email) session.user.email = token.email as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isLoginPath = nextUrl.pathname === "/admin/login";
      const isErrorPath = nextUrl.pathname === "/admin/error";

      if (isOnAdmin) {
        if (isLoginPath || isErrorPath) {
          if (isLoggedIn && isLoginPath) return Response.redirect(new URL("/admin", nextUrl));
          return true; // Let them access the login or error page
        }
        return isLoggedIn; // Redirect to login if not logged in
      }
      return true; // Let them access public routes
    },
    async signIn({ user }) {
      const superAdminEmail = process.env.SUPERADMIN_EMAIL;
      
      // 1. Superadmin is always allowed (driven by .env to bootstrap the system)
      if (user.email === superAdminEmail) {
        return true;
      }
      
      // 2. Check if the user's email exists in the Admin table
      if (user.email) {
        try {
          // Dynamic import of Prisma to avoid edge-runtime issues with NextAuth if applicable,
          // but since this is Node runtime by default it's fine.
          const { default: prisma } = await import('@/lib/prisma');
          const dbAdmin = await prisma.admin.findUnique({
            where: { email: user.email }
          });
          
          if (dbAdmin) {
            return true;
          }
        } catch (error) {
          console.error("Database auth check failed", error);
        }
      }
      
      // Reject if not superadmin and not in DB
      return false; 
    },
  },
});
