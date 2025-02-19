import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { checkCredentials } from "../../api/check.js"; // Import function

console.log("✅ NextAuth is being initialized...");

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("🔄 Received Sign-in Request:", credentials);

                // ✅ Call checkCredentials to verify user
                const user = await checkCredentials(credentials.username, credentials.password);
                console.log("🔍 Debugging checkCredentials result:", user);

                if (!user) {
                    console.log("❌ Invalid username or password");
                    throw new Error("Invalid username or password");
                }

                console.log("✅ Authentication successful for:", user.UserName);

                // ✅ Return both Username and Password
                return {
                    User: credentials.username,
                    Password: credentials.password
                };
            }
        })
    ],
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // ✅ Store username and password in token
                token.User = user.User;
                token.Password = user.Password;
            }
            return token;
        },
        async session({ session, token }) {
            // ✅ Pass username and password to session
            session.user = { User: token.User, Password: token.Password };
            return session;
        }
    },
    debug: true, // ✅ Enable debugging mode
});
