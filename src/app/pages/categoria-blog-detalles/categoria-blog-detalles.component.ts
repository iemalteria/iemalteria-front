import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaBlogService } from '../../services/categoria-blog.service';
import { MenuComponent } from '../../custom/menu/menu.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-categoria-blog-detalles',
  standalone: true,
  imports: [
    MenuComponent, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    CommonModule, 
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './categoria-blog-detalles.component.html',
  styleUrls: ['./categoria-blog-detalles.component.css']
})
export class CategoriaBlogDetallesComponent implements OnInit {
  categoriaForm!: FormGroup;
  categoriaId!: number;
  private fb = inject(FormBuilder);
  private CategoriaBlogService = inject(CategoriaBlogService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.categoriaId = this.route.snapshot.params['id'];

    this.categoriaForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      activo: [true, Validators.required]
    });

    this.cargarCategoria();
  }

  cargarCategoria() {
    this.CategoriaBlogService.obtenerCategoriaPorId(this.categoriaId).subscribe(categoria => {
      this.categoriaForm.patchValue({
        id: categoria.id,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        activo: categoria.activo
      });
    });
  }

  actualizarCategoria() {
    if (this.categoriaForm.valid) {
      this.CategoriaBlogService.actualizarCategoria(this.categoriaId, this.categoriaForm.value).subscribe({
        next: () => {
          this.router.navigate(['/categoria-blog']);
        },
        error: (error) => {
          console.error('Error al actualizar registro Categoria:', error);
        }
      });
    }
  }

  eliminarCategoria() {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.CategoriaBlogService.eliminarCategoria(this.categoriaId).subscribe({
        next: () => {
          this.router.navigate(['/categoria-blog']);
        },
        error: (error) => {
          console.error('Error al eliminar registro Categoria:', error);
        }
      });
    }
  }
}
