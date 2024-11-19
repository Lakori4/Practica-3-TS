import { MongoClient } from 'mongodb'

const url = Deno.env.get("MONGO_URL")

if(!url) Deno.exit(1)

const client = new MongoClient(url)

await client.connect()
console.log("Conectado correctamente a la base de datos")
const db = client.db("Practica3")
const collectionNinos = db.collection("ninos")
const collectionLugares = db.collection("lugares")

const handler = async(req: Request): Promise<Response> => {

  return new Response("Buenas")
}

Deno.serve({port:6768}, handler)