import { Respuesta } from "./respuesta";

export interface Comentario {
    id: number;
    texto: string;
    fecha: string;
    usuarioId: number; // Puedes ajustar los campos según el modelo real
    autor?: string;
    respuestas?: Respuesta[];
  }
  
  // Interfaz para Respuesta
  