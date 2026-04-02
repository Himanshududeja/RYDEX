import { Connection } from "mongoose";

declare global{     //declare global is used to declare global variables that can be accessed across the entire application. In this case, we are declaring a global variable called mongooseConnection that will store the connection to the database.
    var mongooseConnection:{      //mongooseConnection is a global variable that will store the connection to the database. It is an object that has two properties: conn and promise. conn is the actual connection to the database, and promise is a promise that resolves to the connection when it is established.
        conn: Connection | null,
        promise: Promise<Connection> | null
    }
}

export {};