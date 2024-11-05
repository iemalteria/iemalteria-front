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

  lista(): Observable<responseBlog> {
    return this.http.get<responseBlog>(`${this.baseUrl}Blog/lista`);
  }

  obtenerBlogPorId(id: number): Observable<blog> {
    return this.http.get<blog>(`${this.baseUrl}Blog/${id}`);
  }

  obtenerBlogPorCategoriaId(id: number): Observable<responseBlog> {
    return this.http.get<responseBlog>(`${this.baseUrl}Blog/PorCategoria/${id}`);
  }

  // Método para crear un nuevo blog
  crearBlog(nuevoBlog: Omit<blog, 'id'>): Observable<blog> {
    return this.http.post<blog>(`${this.baseUrl}Blog/Crear`, nuevoBlog);
  }
}
