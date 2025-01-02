export interface Respuesta {
    id: number;
    texto: string;
    fecha: string;
    usuarioId: number; // Puedes ajustar los campos según el modelo real
    comentarioId: number;
    autor?: string;
  }