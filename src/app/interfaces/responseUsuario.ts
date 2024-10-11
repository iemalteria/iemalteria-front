export interface responseUsuario {
    isSuccess: boolean;
    usuario?: {
      correo: string;
      nombre: string;
    };
    mensaje?: string;
  }