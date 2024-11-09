import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { responseBlog } from '../interfaces/responseBlog';
import { blog } from '../interfaces/blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);
  private baseUrl: string = appsettings.apiUrl;

  constructor() { }

  // Método para obtener todos los blogs
  lista(): Observable<responseBlog> {
    return this.http.get<responseBlog>(`${this.baseUrl}Blog/lista`);
  }

  // Método para obtener un blog por ID
  obtenerBlogPorId(id: number): Observable<blog> {
    return this.http.get<blog>(`${this.baseUrl}Blog/${id}`);
  }

  // Método para obtener blogs por categoría
  obtenerBlogPorCategoriaId(id: number): Observable<responseBlog> {
    return this.http.get<responseBlog>(`${this.baseUrl}Blog/PorCategoria/${id}`);
  }

  // Método para crear un nuevo blog
  crearBlog(nuevoBlog: Omit<blog, 'id'>): Observable<blog> {
    return this.http.post<blog>(`${this.baseUrl}Blog/Crear`, nuevoBlog);
  }

  // Método para editar un blog existente
  editarBlog(id: number, blogActualizado: blog): Observable<blog> {
    return this.http.put<blog>(`${this.baseUrl}Blog/Editar/${id}`, blogActualizado);
  }

  // Método para eliminar un blog
  eliminarBlog(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}Blog/Eliminar/${id}`);
  }
}
