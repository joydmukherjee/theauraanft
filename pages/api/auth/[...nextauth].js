import NextAuth from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import DiscordProvider from "next-auth/providers/discord";
export const authOptions = {
  providers: [
     DiscordProvider({
      clientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0", // opt-in to Twitter OAuth 2.0
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log('Existing token:', token)
  console.log('Account:', account?.provider)
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.provider = account.provider
         if (account.provider === 'twitter') {
          token.accessToken = account.access_token
        token.twitter_id = profile?.data?.id || profile?.id
        token.twitter_username = profile?.data?.username || profile?.username
         }
          if (account.provider === 'discord') {
          token.discord_id = profile.id
          token.discord_username = profile.username
          token.discord_discriminator = profile.discriminator
        }
}
      return token
    },
    async session({ session, token }) {
      console.log('Session token data:', token)
      // Send properties to the client, like an access_token and user id from a provider.
      session.provider = token.provider
      session.accessToken = token.accessToken
      session.twitter_id = token.twitter_id
      session.twitter_username = token.twitter_username
      session.discord_id = token.discord_id
      session.discord_username = token.discord_username
      session.discord_discriminator = token.discord_discriminator
      
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error', // Error code passed in query string as ?error=
  },
}

export default NextAuth(authOptions)