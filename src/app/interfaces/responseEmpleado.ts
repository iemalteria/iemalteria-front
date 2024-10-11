import { empleado } from "./empleado";

export interface responseEmpleado {
    value: empleado[]; // Lista de empleados
    // Puedes agregar otras propiedades según tu respuesta de la API
  }