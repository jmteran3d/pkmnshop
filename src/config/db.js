import mongoose from "mongoose"

export const conectarDB=(url, dbName)=>{
    try {
        mongoose.connect(
            url,
            {
                // dbName: dbName,
                dbName
            }
        )
        console.log(`DB online...!!!`)
    } catch (error) {
        console.log(`Error al conectar a DB: ${error.message}`)
    }
}