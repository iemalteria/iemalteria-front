// src/app/services/productos.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto';
import { ResponseProducto } from '../interfaces/responseProducto';
import { appsettings } from '../settings/appsettings';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private http = inject(HttpClient);
  private baseUrl: string = appsettings.apiUrl;

  constructor() { }

  // Método para obtener la lista de productos
  lista(): Observable<ResponseProducto> {
    return this.http.get<ResponseProducto>(`${this.baseUrl}Productos/Lista`);
  }

  // Método para obtener un producto por ID
  obtenerProductoPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}Productos/${id}`);
  }

  // Método para crear un nuevo producto
  crearProducto(nuevoProducto: Omit<Producto, 'id'>): Observable<Producto> {
    return this.http.post<Producto>(`${this.baseUrl}Productos/Crear`, nuevoProducto);
  }

  // Método para actualizar un producto existente
  actualizarProducto(id: number, productoActualizado: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}Productos/Actualizar/${id}`, productoActualizado);
  }

  // Método para eliminar un producto
  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}Productos/Eliminar/${id}`);
  }
}
