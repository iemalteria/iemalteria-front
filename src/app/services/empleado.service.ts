import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { empleado } from '../interfaces/empleado';
import { responseEmpleado } from '../interfaces/responseEmpleado';


@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private http = inject(HttpClient);
  private baseUrl: string = appsettings.apiUrl;

  constructor() { }

  // Método para obtener la lista de empleados
  lista(): Observable<responseEmpleado> {
    return this.http.get<responseEmpleado>(`${this.baseUrl}Empleado/lista`);
  }

  // Método para obtener un empleado por ID
  obtenerEmpleadoPorId(id: number): Observable<empleado> {
    return this.http.get<empleado>(`${this.baseUrl}Empleado/${id}`);
  }

  // Método para crear un nuevo empleado
  crearEmpleado(nuevoEmpleado: Omit<empleado, 'id'>): Observable<empleado> {
    return this.http.post<empleado>(`${this.baseUrl}Empleado/Crear`, nuevoEmpleado);
  }

  // Método para actualizar un empleado existente
  actualizarEmpleado(id: number, empleadoActualizado: empleado): Observable<empleado> {
    return this.http.put<empleado>(`${this.baseUrl}Empleado/Actualizar/${id}`, empleadoActualizado);
  }

  // Método para eliminar un empleado
  eliminarEmpleado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}Empleado/Eliminar/${id}`);
  }
}
