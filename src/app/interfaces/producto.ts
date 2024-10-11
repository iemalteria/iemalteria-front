export interface Producto {
    id?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagenUrl: string;
    categoria: string;
    tipo: string;
    activo?: boolean;
  }