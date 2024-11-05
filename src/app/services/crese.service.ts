import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { responseCrese } from '../interfaces/responseCrese';
import { Crese } from '../interfaces/crese'

@Injectable({
  providedIn: 'root'
})
export class CreseService {
  private http = inject(HttpClient);
  private baseUrl: string = appsettings.apiUrl;

  constructor() { }

  // Método para obtener la lista de registros Crese
  lista(): Observable<responseCrese> {
    return this.http.get<responseCrese>(`${this.baseUrl}Crese`);
  }

  // Método para obtener un registro Crese por ID
  obtenerCresePorId(id: number): Observable<Crese> {
    return this.http.get<Crese>(`${this.baseUrl}Crese/${id}`);
  }

  // Método para crear un nuevo registro Crese
  crearCrese(nuevoCrese: Omit<Crese, 'id'>): Observable<Crese> {
    return this.http.post<Crese>(`${this.baseUrl}Crese`, nuevoCrese);
  }

  // Método para actualizar un registro Crese existente
  actualizarCrese(id: number, CreseActualizado: Crese): Observable<Crese> {
    return this.http.put<Crese>(`${this.baseUrl}Crese/${id}`, CreseActualizado);
  }

  // Método para eliminar un registro Crese
  eliminarCrese(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}Crese/${id}`);
  }
}
