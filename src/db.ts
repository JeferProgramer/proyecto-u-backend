import mongoose from 'mongoose'
require('dotenv').config();
const {DB_NAME, DB_PASSWORD, DB_USERNAME, DB_CLUSTERNAME} = process.env


// Database Connection
export default async function connectDB() {
   try{
      // const db = await mongoose.connect('mongodb+srv://proyectogrupal:VNWSkd5ixj7hLVTo@proyectogrupal.z5mrv.mongodb.net/ProyectoGrupaltest?retryWrites=true&w=majority')
      const db = await mongoose.connect('mongodb+srv://JeferProgramer:lCPUbDx4ruw69JuU@cluster0.idi71m2.mongodb.net/')
      console.log('database is connected to', db.connection.db.databaseName)
   }catch(e){
      console.log(e)
   }
}