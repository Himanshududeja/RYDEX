import mongoose from "mongoose";
const mongodbUrl = process.env.MONGODB_URL;

if(!mongodbUrl){
    throw new Error("db url not found");
}

let cached=global.mongooseConnection;   //field //global is used to store the connection across hot reloads in development
if(!cached){
    cached=global.mongooseConnection={conn:null, promise:null}
}

const connectDb=async()=>{      //connectDb is an async function that will connect to the database and return the connection. It will check if there is a cached connection, if there is, it will return the cached connection. If there is no cached connection, it will create a new connection and cache it before returning it.
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){
        cached.promise=mongoose.connect(mongodbUrl).then(c=>c.connection);
    }
    try{                            //wait for the promise to resolve and return the connection. If there is an error, it will catch the error and log it.
        const conn=await cached.promise;
        return conn;
    } catch(error){
        console.log("error connecting to db", error);
    }
}

export default connectDb;