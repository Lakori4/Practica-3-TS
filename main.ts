import { MongoClient } from 'mongodb'

const url = Deno.env.get("MONGO_URL")

if(!url) Deno.exit(1)

const client = new MongoClient(url)

await client.connect()
console.log("Conectado correctamente a la base de datos")
const db = client.db("Practica3")
const collection = db.collection("ninos")