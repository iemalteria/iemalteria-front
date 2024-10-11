import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MenuComponent } from '../../custom/menu/menu.component';
import { Producto } from '../../interfaces/producto';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-producto-detalles',
  standalone: true,
  imports: [MenuComponent, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './producto-detalles.component.html',
  styleUrls: ['./producto-detalles.component.css']
})
export class ProductoDetallesComponent implements OnInit {
  productoForm!: FormGroup;
  productoId!: number;
  categorias: string[] = ['Mujer', 'Hombre', 'Niño', 'Huerta', 'Emprendimientos'];
  tiposDisponibles: string[] = [];
  private fb = inject(FormBuilder);
  private productoService = inject(ProductosService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    // Obtener el ID del producto desde la URL
    this.productoId = this.route.snapshot.params['id'];

    // Inicializar el formulario
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      imagenUrl: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      tipo: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]]
    });

    // Cargar datos del producto
    this.cargarProducto();
    this.updateCharacterCount()
  }

  cargarProducto() {
    this.productoService.obtenerProductoPorId(this.productoId).subscribe((producto: Producto) => {
      this.productoForm.patchValue({
        nombre: producto.nombre,
        imagenUrl: producto.imagenUrl,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        tipo: producto.tipo,
        precio: producto.precio
      });
      this.onCategoriaChange(producto.categoria);
    });
  }

  onCategoriaChange(categoria: string) {
    if (categoria === 'Mujer' || categoria === 'Hombre' || categoria === 'Niño') {
      this.tiposDisponibles = ['Zapatos', 'Pantalon', 'Camisas', 'Otros'];
    } else if (categoria === 'Huerta') {
      this.tiposDisponibles = ['Frutas', 'Verduras'];
    } else if (categoria === 'Emprendimientos') {
      this.tiposDisponibles = ['Otros'];
    }
    this.productoForm.get('tipo')?.setValue('');  // Resetea el campo tipo al cambiar categoría
  }

  // Método para actualizar el producto
  actualizarProducto() {
    if (this.productoForm.valid) {
      this.productoService.actualizarProducto(this.productoId, this.productoForm.value).subscribe({
        next: () => {
          this.router.navigate(['/tienda-productos']); // Redirige a la lista de productos después de actualizar
        },
        error: (error) => {
          console.error('Error al actualizar producto:', error);
        }
      });
    }
  }

  // Método para eliminar el producto
  eliminarProducto() {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.eliminarProducto(this.productoId).subscribe({
        next: () => {
          this.router.navigate(['/tienda-productos']); // Redirige a la lista de productos después de eliminar
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
        }
      });
    }
  }

  characterCount = 0;

updateCharacterCount() {
    this.characterCount = this.productoForm.get('descripcion')?.value.length || 0;
}
}
