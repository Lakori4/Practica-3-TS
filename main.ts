import { MongoClient } from 'mongodb'
import type { LugarModel, NinoModel } from "./type.ts";
import { getNinoLugar } from "./resolves.ts";

const url = Deno.env.get("MONGO_URL")

if(!url) Deno.exit(1)

const client = new MongoClient(url)

await client.connect()
console.log("Conectado correctamente a la base de datos")
const db = client.db("Practica3")
const ninoCollection = db.collection<NinoModel>("ninos")
const lugarCollection = db.collection<LugarModel>("lugares")

const handler = async(req: Request): Promise<Response> => {
  const url = new URL(req.url)
  const method = req.method
  const path = url.pathname

  if(method === "GET") {
    if(path === "/ninos/buenos") {
      const result = await ninoCollection.find({comportamiento:true}).toArray()
      const resultFinal = await Promise.all(result.map(e => getNinoLugar(e,lugarCollection))) 
      return new Response(JSON.stringify(resultFinal))
    } else if(path === "/ninos/malos") {
      const result = await ninoCollection.find({comportamiento:false}).toArray()
      const resultFinal = await Promise.all(result.map(e => getNinoLugar(e,lugarCollection))) 
      return new Response(JSON.stringify(resultFinal))
    }
  } else if(method === "  POST") {

  }

  return new Response("Endpoint not found", {status:404})
}

Deno.serve({port:6768}, handler)