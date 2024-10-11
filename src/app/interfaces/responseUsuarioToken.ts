export interface responseUsuarioToken {
    isSuccess: boolean;
    mensaje?: string;
    usuario?: {
      id: number;
      email: string;
    };
  }