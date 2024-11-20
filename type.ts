import type { ObjectId, OptionalId } from "mongodb";

type coordenadas = {
    x: number,
    y:number
}

export type NinoModel = OptionalId<{
    nombre: string,
    comportamiento: boolean,
    ubicacion: ObjectId
}>

export type LugarModel = OptionalId<{
    nombre: string,
    coordenadas: coordenadas,
    buenos: number
}>

export type Lugar = {
    _id: string
    nombre: string,
    coordenadas: coordenadas,
    buenos: number
}

export type Nino = {
    _id: string
    nombre: string,
    comportamiento: string,
    ubicacion: Lugar
}