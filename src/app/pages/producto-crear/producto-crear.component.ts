import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../custom/menu/menu.component';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-producto-crear',
  standalone: true,
  imports: [
    MenuComponent,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatButtonModule
  ],
  templateUrl: './producto-crear.component.html',
  styleUrls: ['./producto-crear.component.css'],
})
export class ProductoCrearComponent {
  productoForm: FormGroup;
  characterCount = 0;
  categorias: string[] = ['Mujer', 'Hombre', 'Niño', 'Huerta', 'Emprendimientos'];
  tipos: string[] = [];
  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    public router: Router
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      imagenUrl: ['', [Validators.required]],
      precio: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
    });

    this.productoForm.get('categoria')?.valueChanges.subscribe((categoria) => {
      this.updateTipoOptions(categoria);
    });
    this.updateCharacterCount()
  }

  get nombre() {
    return this.productoForm.get('nombre');
  }

  get imagenUrl() {
    return this.productoForm.get('imagenUrl');
  }

  get precio(){
    return this.productoForm.get('precio');
  }

  get descripcion() {
    return this.productoForm.get('descripcion');
  }

  get categoria() {
    return this.productoForm.get('categoria');
  }

  get tipo() {
    return this.productoForm.get('tipo');
  }

  updateTipoOptions(categoria: string) {
    switch (categoria) {
      case 'Mujer':
      case 'Hombre':
      case 'Niño':
        this.tipos = ['Zapatos', 'Pantalon', 'Camisas', 'Otros'];
        break;
      case 'Huerta':
        this.tipos = ['Frutas', 'Verduras'];
        break;
      case 'Emprendimientos':
        this.tipos = ['Otros'];
        break;
      default:
        this.tipos = [];
    }
  }

  crearProducto() {
    if (this.productoForm.valid) {
      const nuevoProducto = this.productoForm.value;
      this.productosService.crearProducto(nuevoProducto).subscribe({
        next: () => {
          this._snackBar.open('El producto se ha añadido correctamente', 'Aceptar', { duration: 5000 });
          this.router.navigate(['tienda-productos']);
        },
        error: (error) => {
          this._snackBar.open('Error al añadir el producto: ' + error.message, 'Aceptar', { duration: 5000 });
        },
      });
    } else {
      this._snackBar.open('Formulario inválido', 'Aceptar', { duration: 5000 });
    }
  }
  

updateCharacterCount() {
    this.characterCount = this.productoForm.get('descripcion')?.value.length || 0;
}
}
