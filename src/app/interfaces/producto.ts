import { ProductoImagenes } from "./productoImagenes";

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    precio2?: number;
    categoria: string;
    tipo: string;
    activo?: boolean;
    productoImagenes: ProductoImagenes[];
    videoUrl: string;
  }