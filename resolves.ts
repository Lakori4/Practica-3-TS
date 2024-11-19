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