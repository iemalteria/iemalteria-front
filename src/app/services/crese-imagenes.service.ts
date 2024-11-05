import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { CreseImagenes } from '../interfaces/creceImagenes';
import { responseCreseImagenes } from '../interfaces/responseCreseImagenes';

@Injectable({
  providedIn: 'root'
})
export class CreseImagenesService {
  private http = inject(HttpClient);
  private baseUrl: string = `${appsettings.apiUrl}CreseImagenes`;

  constructor() { }

  // Método para obtener la lista de registros CreseImagenes
  lista(): Observable<responseCreseImagenes> {
    return this.http.get<responseCreseImagenes>(this.baseUrl);
  }

  // Método para obtener un registro CreseImagen por ID
  obtenerCreseImagenPorId(id: number): Observable<CreseImagenes> {
    return this.http.get<CreseImagenes>(`${this.baseUrl}/${id}`);
  }

  // Método para obtener un registro CreseImagen por ID
  obtenerCreseImagenPorCreseId(id: number): Observable<responseCreseImagenes> {
    return this.http.get<responseCreseImagenes>(`${this.baseUrl}/crese/${id}`);
  }

  // Método para crear un nuevo registro CreseImagen
  crearCreseImagen(nuevaCreseImagen: Omit<CreseImagenes, 'id'>): Observable<CreseImagenes> {
    return this.http.post<CreseImagenes>(this.baseUrl, nuevaCreseImagen);
  }

  // Método para actualizar un registro CreseImagen existente
  actualizarCreseImagen(id: number, creseImagenActualizada: CreseImagenes): Observable<CreseImagenes> {
    return this.http.put<CreseImagenes>(`${this.baseUrl}/${id}`, creseImagenActualizada);
  }

  // Método para eliminar un registro CreseImagen
  eliminarCreseImagen(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
