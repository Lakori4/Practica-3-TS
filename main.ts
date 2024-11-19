import { MongoClient } from 'mongodb'
import type { LugarModel, NinoModel } from "./type.ts";

const url = Deno.env.get("MONGO_URL")

if(!url) Deno.exit(1)

const client = new MongoClient(url)

await client.connect()
console.log("Conectado correctamente a la base de datos")
const db = client.db("Practica3")
const ninoCollection = db.collection<NinoModel>("ninos")
const lugarCollection = db.collection<LugarModel>("lugares")

const handler = async(req: Request): Promise<Response> => {

  return new Response("Buenas")
}

Deno.serve({port:6768}, handler)