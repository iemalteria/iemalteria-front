import { CreseImagenes } from "./creceImagenes";

export interface Crese{
    id:number,
    titulo: string,
    texto: string,
    videoUrl: string,
    creseImagenes: CreseImagenes[]
}