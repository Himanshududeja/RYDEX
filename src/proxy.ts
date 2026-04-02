import { NextRequest, NextResponse } from "next/server"
import { auth } from "./auth"

const PUBLIC_ROUTES=["/"]

export async function proxy(req:NextRequest){      //middleware function that will be used to proxy requests to the backend server. It will take the request and response objects as parameters and will forward the request to the backend server using the fetch API. The response from the backend server will then be sent back to the client.
    const {pathname}=req.nextUrl
    if(
        pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico") || /\.(png|jpg|jpeg|svg|ico|gif|webp)$/i.test(pathname)        //This condition checks if the pathname of the request starts with "/_next" or "/favicon.ico" or if it ends with any of the specified image file extensions (png, jpg, jpeg, svg, ico, gif, webp). If any of these conditions are true, it means that the request is for a static asset (like JavaScript files, CSS files, images, etc.) that should be served directly without any authentication checks. In such cases, the middleware will simply call NextResponse.next() to allow the request to proceed without any further processing.
    ){
        return NextResponse.next()
    }

    if(PUBLIC_ROUTES.includes(pathname)){
        return NextResponse.next()
    }
    if(pathname.startsWith("/api/auth")){
        return NextResponse.next()
    }

    const session=await auth()
    if(!session){
        return NextResponse.redirect(new URL("/",req.url))
    }

    const role=session.user?.role
    if(pathname.startsWith("/admin")){
        if(role!=="admin"){
            return NextResponse.redirect(new URL("/",req.url))
        }
    }
    if(pathname.startsWith("/partner")){
        if(pathname.startsWith("/partner/onboarding")){
            return NextResponse.next()
        }
        if(role!=="partner"){
            return NextResponse.redirect(new URL("/",req.url))
        }
    }

    if(pathname.startsWith("/api")){
        if(!session || !session.user){
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }
    }

    return NextResponse.next()
}

export const config={
    matcher:["/((?!_next/static|_next/image|favicon.ico).*)"]           //matcher is a property that specifies the paths that should be handled by this middleware. In this case, we are using a regular expression to match all paths except those that start with _next/static, _next/image, or favicon.ico. This ensures that the middleware will only handle requests that are not for static assets or the favicon.
}