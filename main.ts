import { MongoClient, ObjectId } from 'mongodb'
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

      if (!ubi.nombre || ubi.coordenadas.x == undefined || ubi.coordenadas.y == undefined || ubi.buenos === undefined) {
        return new Response ("Bad request", { status: 400} )
      }

      if (ubi.coordenadas.x  < -180 || ubi.coordenadas.x > 180) {
        return new Response ("Longitud no válida", { status: 410} )
      }
      

      if (ubi.coordenadas.y  < -90 || ubi.coordenadas.x > 90) {
        return new Response ("Latitud no válida", { status: 411} )
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

      return new Response ("Lugar introducido correctamente", {status: 201} );

    }

    if (path === "/ninos") {
      const nino = await req.json()

      if (!nino.nombre || !nino.ubicacion || !(nino.comportamiento === "bueno" || nino.comportamiento === "malo")){
        return new Response ("Bad request", { status: 400} )
      }

      const ninoDB = await ninoCollection.findOne({
        nombre: nino.nombre
      })

      if (ninoDB) { return new Response ("Niño ya existe", {status: 409})}

      const ubiDB = await lugarCollection.findOne({
        _id : new ObjectId(nino.ubicacion)
      })

      if (!ubiDB) { return new Response ("Ubicación no existe", {status: 408})}

      let comportamiento: boolean

      if (nino.comportamiento === "bueno") {
        comportamiento = true
      } else {
        comportamiento = false
      }

      const insertedId = await ninoCollection.insertOne ({
        nombre: nino.nombre,
        comportamiento,
        ubicacion: new ObjectId(nino.ubicacion)
      })

      return new Response ("Niño introducido correctamente", {status: 201} );
      
    }
  }

  
   return new Response ("Endpoint not found", {status: 404})
  
}

Deno.serve({port:6768}, handler)