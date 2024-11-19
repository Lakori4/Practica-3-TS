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

  const url = new URL(req.url)
  const method = req.method
  const path = url.pathname

  if (method === "GET") {

  }

  else if (method === "POST") {
    if (path === "/ubicacion") {
      const ubi = await req.json();

      if (!ubi.nombre || ubi.buenos < 0) {
        return new Response ("Bad request", { status: 400} )
      }

      const ubiDB = await lugarCollection.findOne({
        nombre: ubi.nombre
      })

      if (ubiDB) { return new Response ("Ubicación ya existe", {status: 409})}

      const insertedId = await lugarCollection.insertOne ({
        nombre: ubi.nombre,
        coordenadas: ubi.coordenadas,
        buenos: ubi.buenos
      })

      return new Response (
        JSON.stringify({
          nombre: ubi.nombre,
          coordenadas: ubi.coordenadas,
          buenos: ubi.buenos,
          id: insertedId,
        }), {status: 201}
      );
    }
  }

  
   return new Response ("Endpoint not found", {status: 404})
  
}

Deno.serve({port:6768}, handler)