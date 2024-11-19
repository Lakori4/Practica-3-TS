import type { Collection, ObjectId, } from "mongodb";
import type { LugarModel, NinoModel, Lugar, Nino} from "./type.ts";

export const getLugarID = async(
    id: ObjectId,
    lugarCollection: Collection<LugarModel>
):Promise<Lugar> => {
    const aux = await lugarCollection.findOne({_id:id})
    return ({
        _id: aux!._id.toString(),
        nombre: aux!.nombre,
        coordenadas: aux!.coordenadas,
        buenos: aux!.buenos
    })
}   

export const getNinoLugar = async(
    user: NinoModel,
    lugarCollection: Collection<LugarModel>
):Promise<Nino> => {
    return ({
        _id: user._id.toString(),
        nombre: user.nombre,
        comportamiento: user.comportamiento ? "bueno": "malo",
        ubicacion: await getLugarID(user.ubicacion,lugarCollection)
    })
}
//inserta la cantidad de niños buenos dentro el valor buenos de la tabla lugares
export const setNinosBuenos = async(
    ninoCollection: Collection<NinoModel>,
    lugarCollection: Collection<LugarModel>
) => {
    const almacenLugares = (await lugarCollection.find().toArray()).map(e => e._id)
    almacenLugares.forEach(async(e) => {
        const almacenNinosBuenos = await ninoCollection.find({ubicacion:e, comportamiento:true}).toArray()
        await lugarCollection.updateOne(
            {_id:e},
            {$set:{buenos:almacenNinosBuenos.length}})
    })
}   

export const haversine = (
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
) => {
    const R = 6371; // Radio de la Tierra en km
    const toRad = (deg:number) => (deg * Math.PI) / 180; // Conversión a radianes

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
  } 