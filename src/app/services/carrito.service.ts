import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private productosCarrito: Producto[] = [];

  constructor() {}

  // Agregar producto al carrito
  agregarAlCarrito(producto: Producto): void {
    this.productosCarrito.push(producto);
  }

  // Obtener productos del carrito
  obtenerCarrito(): Producto[] {
    return this.productosCarrito;
  }

  // Eliminar un producto del carrito
  eliminarDelCarrito(producto: Producto): void {
    const index = this.productosCarrito.indexOf(producto);
    if (index !== -1) {
      this.productosCarrito.splice(index, 1);
    }
  }

  // Vaciar el carrito
  vaciarCarrito(): void {
    this.productosCarrito = [];
  }
}
