import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginUserResponse } from "./app/lib/definitions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "username",
          type: "text",
        },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/usuarios/login`,
            {
              method: "POST",
              body: JSON.stringify({
                username: credentials?.username,
                password: credentials?.password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );

          // Si la API responde con error (404, 401, etc.)
          if (!res.ok) {
            const errResp = await res.json().catch(() => null);
            // Mostrar mensaje devuelto por la API o mensaje genérico
            const msg =
              errResp?.message || `Error ${res.status}: ${res.statusText}`;
            throw new Error(msg);
          }

          // Aquí sí es 200 OK
          const resp = await res.json();
          console.log(">>", resp);

          // Si tu API devuelve algo indicando login inválido:
          if (!resp || !resp.token) {
            return null; // NextAuth lo toma como credenciales inválidas
          }

          // Usuario válido:
          const user: User = {
            username: resp.username,
            token: resp.token,
            status: resp.status,
            codigoUsuario: resp.codigoUsuario,
          };

          return user;
        } catch (err) {
          console.error("Error en authorize:", err);
          throw err; // NextAuth mostrará error en responseNextAuth.error
        }
      },
    }),
  ],
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    //error: "/login?error=CredentialsSignin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        //token.username = user.username;
        token.username = user.username;
        token.token = user.token;
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = token as any;
        //session.user.token = token.token;
      }
      return session;
    },
  },
});
