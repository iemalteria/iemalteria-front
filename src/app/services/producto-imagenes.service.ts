import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { responseProductoImagenes } from '../interfaces/responseProductoImagenes';
import { ProductoImagenes } from '../interfaces/productoImagenes';

@Injectable({
  providedIn: 'root'
})
export class ProductoImagenesService {

  private http = inject(HttpClient);
  private baseUrl: string = `${appsettings.apiUrl}ProductoImagenes`;

  constructor() { }
  // Método para obtener la lista de registros ProductoImagenes
  lista(): Observable<responseProductoImagenes> {
    return this.http.get<responseProductoImagenes>(this.baseUrl);
  }

  // Método para obtener un registro ProductoImagen por ID
  obtenerProductoImagenPorId(id: number): Observable<ProductoImagenes> {
    return this.http.get<ProductoImagenes>(`${this.baseUrl}/${id}`);
  }

  // Método para obtener un registro ProductoImagen por ID
  obtenerProductoImagenPorProductoId(id: number): Observable<responseProductoImagenes> {
    return this.http.get<responseProductoImagenes>(`${this.baseUrl}/producto/${id}`);
  }

  // Método para crear un nuevo registro ProductoImagen
  crearProductoImagen(nuevaProductoImagen: Omit<ProductoImagenes, 'id'>): Observable<ProductoImagenes> {
    return this.http.post<ProductoImagenes>(this.baseUrl, nuevaProductoImagen);
  }

  // Método para actualizar un registro ProductoImagen existente
  actualizarProductoImagen(id: number, productoImagenActualizada: ProductoImagenes): Observable<ProductoImagenes> {
    return this.http.put<ProductoImagenes>(`${this.baseUrl}/${id}`, productoImagenActualizada);
  }

  // Método para eliminar un registro ProductoImagen
  eliminarProductoImagen(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
