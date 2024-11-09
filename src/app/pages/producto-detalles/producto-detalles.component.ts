import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProductoImagenesService } from '../../services/producto-imagenes.service';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-producto-detalles',
  standalone: true,
  imports: [MenuComponent, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatCardModule, CommonModule, MatButtonModule, MatSlideToggleModule, MatIconModule],
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
  private productoImagenesService = inject(ProductoImagenesService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.productoId = this.route.snapshot.params['id'];

    // Inicializar el formulario
    this.productoForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      tipo: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      precio2: [''],
      activo: [true],
      videoUrl: [''],
      productoImagenes: this.fb.array([])  // FormArray para las imágenes
    });

    this.cargarProducto();
    this.cargarImagenes();
    this.updateCharacterCount();
  }
  get productoImagenes(): FormArray {
    return this.productoForm.get('productoImagenes') as FormArray;
  }

  cargarProducto() {
    this.productoService.obtenerProductoPorId(this.productoId).subscribe((producto: Producto) => {
      this.productoForm.patchValue({
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        tipo: producto.tipo,
        precio: producto.precio,
        precio2: producto.precio2,
        activo: producto.activo,
        videoUrl: producto.videoUrl
      });
      this.onCategoriaChange(producto.categoria);
    });
  }

  cargarImagenes() {
    this.productoImagenesService.obtenerProductoImagenPorProductoId(this.productoId).subscribe((response) => {
      const imagenesControl = this.productoForm.get('productoImagenes') as FormArray;
      response.value.forEach(imagen => {
        imagenesControl.push(this.fb.group({
          id: [imagen.id],
          productoId: [imagen.productoId, Validators.required],
          imagenUrl: [imagen.imagenUrl, Validators.required],
        }));
      });
    });
  }

  onCategoriaChange(categoria: string) {
    if (categoria === 'Mujer' || categoria === 'Hombre' || categoria === 'Niño') {
      this.tiposDisponibles = ['Zapatos', 'Pantalon', 'Camisas', 'Otros'];
    } else if (categoria === 'Huerta') {
      this.tiposDisponibles = ['Frutas', 'Verduras'];
    } else if (categoria === 'Emprendimientos') {
      this.tiposDisponibles = ['Varios'];
    }
    this.productoForm.get('tipo')?.setValue('');
  }

  actualizarProducto() {
    if (this.productoForm.valid) {
      const imagenesControl = this.productoForm.get('productoImagenes') as FormArray;

      this.productoService.actualizarProducto(this.productoId, this.productoForm.value).subscribe({
        next: () => {
          imagenesControl.controls.forEach((imagenForm, index) => {
            const imagenId = imagenesControl.at(index).get('id')?.value;

            if (imagenId) {
              this.productoImagenesService.actualizarProductoImagen(imagenId, imagenForm.value).subscribe();
            } else {
              let nuevaImagen = {
                imagenUrl: imagenForm.value.imagenUrl,
                productoId: this.productoForm.get('id')?.value
              };
              this.productoImagenesService.crearProductoImagen(nuevaImagen).subscribe();
            }
          });
          this.router.navigate(['/tienda-productos']);
        },
        error: (error) => {
          console.error('Error al actualizar producto:', error);
        }
      });
    }
  }

  agregarImagen() {
    const imagenesControl = this.productoForm.get('productoImagenes') as FormArray;
    imagenesControl.push(this.fb.group({
      id: [''],
      productoId: [this.productoId],
      imagenUrl: ['', Validators.required],
    }));
  }

  eliminarImagen(index: number) {
      const imagenesControl = this.productoForm.get('productoImagenes') as FormArray;
      const imagenId = imagenesControl.at(index).get('id')?.value;

      if (imagenId) {
        this.productoImagenesService.eliminarProductoImagen(imagenId).subscribe({
          next: () => {
    imagenesControl.removeAt(index);
          },
          error: (error) => {
            console.error('Error al eliminar imagen:', error);
          }
        });
      } else {
        imagenesControl.removeAt(index); // Eliminar si no hay ID (nuevo registro)
      }
    }

    guardarImagen(imagenForm: FormGroup) {
      const imagenId = imagenForm.get('id')?.value;
      const imagenData = imagenForm.value;
    
      if (imagenId) {
        // Actualizar imagen existente
        this.productoImagenesService.actualizarProductoImagen(imagenId, imagenData).subscribe({
        next: () => {
          this.router.navigate(['/tienda-productos']);
        },
        error: (error) => {
            console.error('Error al actualizar imagen:', error);
          }
        });
      } else {
        // Crear nueva imagen (opcional, en caso de necesitarlo)
        this.productoImagenesService.crearProductoImagen(imagenData).subscribe({
          next: () => {
            console.log('Imagen creada correctamente');
          },
          error: (error) => {
            console.error('Error al crear imagen:', error);
        }
      });
    }
  }

  characterCount = 0;

  updateCharacterCount() {
    this.characterCount = this.productoForm.get('descripcion')?.value.length || 0;
  }

  eliminarProducto() {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      this.productoService.eliminarProducto(this.productoId).subscribe({
        next: () => {
          this.router.navigate(['/tienda-productos']);
        },
        error: (error) => {
          console.error('Error al eliminar registro Crese:', error);
        }
      });
    }
  }
}
