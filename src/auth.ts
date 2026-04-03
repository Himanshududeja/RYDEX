
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials" 
import connectDb from "./lib/db"
import User from "./models/user.model"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
  credentials: {
    email: {
      type: "email",
      label: "Email",
      placeholder: "johndoe@gmail.com",
    },
    password: {
      type: "password",
      label: "Password",
      placeholder: "*****",
    },
  },
  async authorize(credentials,request) {
    // Add logic here to look up the user from the credentials supplied
    if(!credentials.email || !credentials.password){
        throw Error("missing credentials")
    }
    const email=credentials.email;
    const password=credentials.password as string;
    await connectDb()
    const user=await User.findOne({email})
    if(!user){
        throw Error("user does not exist")
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        throw Error("invalid password")
    }
    return {
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
    }
  }

}),
Google({
    clientId: process.env.AUTH_GOOGLE_ID as string,
    clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
})
  ],
  callbacks:{       //callbacks are functions that are called at different stages of the authentication process. In this case, we are defining a callback for the jwt stage, which is called when a JWT token is being created or updated. The jwt callback receives the token and the user object (if the user is being authenticated) as parameters. We can use this callback to add custom properties to the token or to perform any other logic that we need during the authentication process.
    async signIn({user,account}){
        if(account?.provider=="google"){
            await connectDb();
            const dbUser=await User.findOne({email:user.email})
            if(!dbUser){
                await User.create({
                    name:user.name,
                    email:user.email,
                })
            }
            user.id=dbUser.id
            user.role=dbUser.role
        }
        return true;
    },
    async jwt({ token, user }) {
      // On login
      if (user) {
        token.name = user.name
        token.id = user.id
        token.email = user.email
        token.role = user.role
      }

      // 🔥 Always sync latest role from DB
      await connectDb()
      const dbUser = await User.findById(token.id)

      if (dbUser) {
        token.role = dbUser.role
      }

      return token
    },
    async session({session,token}){
        if(token){
            session.user.name=token.name;
            session.user.email=token.email as string;
            session.user.role=token.role as string;
            session.user.id=token.id as string;
        }
        return session;
    },
    
  },
  pages:{
    signIn:"/signin"
  },
  session:{
    strategy:"jwt",
    maxAge:10*24*60*60, //10 days
  },
  secret:process.env.AUTH_SECRET
})