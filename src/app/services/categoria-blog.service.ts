import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { CategoriaBlog } from '../interfaces/categoriaBlog';
import { responseCategoriaBlog } from '../interfaces/responseCategoriaBlog';

@Injectable({
  providedIn: 'root'
})
export class CategoriaBlogService {
  private http = inject(HttpClient);
  private baseUrl: string = appsettings.apiUrl;

  constructor() { }

  // Método para obtener la lista de categorías
  lista(): Observable<responseCategoriaBlog> {
    return this.http.get<responseCategoriaBlog>(`${this.baseUrl}CategoriaBlog`);
  }

  // Método para obtener una categoría por ID
  obtenerCategoriaPorId(id: number): Observable<CategoriaBlog> {
    return this.http.get<CategoriaBlog>(`${this.baseUrl}CategoriaBlog/${id}`);
  }

  // Método para crear una nueva categoría
  crearCategoria(nuevaCategoria: Omit<CategoriaBlog, 'id'>): Observable<CategoriaBlog> {
    return this.http.post<CategoriaBlog>(`${this.baseUrl}CategoriaBlog`, nuevaCategoria);
  }

  // Método para actualizar una categoría existente
  actualizarCategoria(id: number, categoriaActualizada: CategoriaBlog): Observable<CategoriaBlog> {
    return this.http.put<CategoriaBlog>(`${this.baseUrl}CategoriaBlog/${id}`, categoriaActualizada);
  }

  // Método para eliminar una categoría
  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}CategoriaBlog/${id}`);
  }
}
