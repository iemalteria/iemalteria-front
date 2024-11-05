import { usuario } from "./usuario";

export interface responseUsuario {
    isSuccess: boolean;
    usuario?: {
      id: number;
      correo: string;
      nombre: string;
      rol:string;
    };
    mensaje?: string;
  }

export interface responseUsuarios {
  isSuccess: boolean;
  value: usuario[];
}