import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoriaBlogService } from '../../services/categoria-blog.service';
import { MenuComponent } from '../../custom/menu/menu.component';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-categoria-blog',
  standalone: true,
  imports: [
    MenuComponent,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './categoria-blog.component.html',
  styleUrls: ['./categoria-blog.component.css']
})
export class CategoriaBlogComponent {
  categoriaForm: FormGroup;
  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private categoriaBlogService: CategoriaBlogService,
    public router: Router
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      activo: [true] // Inicializa el campo 'activo' como falso
    });
  }

  get nombre() {
    return this.categoriaForm.get('nombre');
  }

  get descripcion() {
    return this.categoriaForm.get('descripcion');
  }

  crearCategoria() {
    if (this.categoriaForm.valid) {
      const nuevaCategoria = this.categoriaForm.value;
      this.categoriaBlogService.crearCategoria(nuevaCategoria).subscribe({
        next: () => {
          this._snackBar.open('Categoría creada exitosamente', 'Aceptar', { duration: 5000 });
          this.router.navigate(['categoria-blog']);
        },
        error: (error) => {
          this._snackBar.open('Error al crear la categoría: ' + error.message, 'Aceptar', { duration: 5000 });
        }
      });
    } else {
      this._snackBar.open('Formulario inválido', 'Aceptar', { duration: 5000 });
    }
  }
}
