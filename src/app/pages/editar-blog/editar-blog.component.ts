import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../services/blog.service';
import { CategoriaBlogService } from '../../services/categoria-blog.service';
import { blog } from '../../interfaces/blog';
import { CategoriaBlog } from '../../interfaces/categoriaBlog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuillModule } from 'ngx-quill';
import { MenuComponent } from '../../custom/menu/menu.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-blog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MatSelectModule,
    MatSnackBarModule,
    QuillModule,
    MenuComponent,
    ReactiveFormsModule
  ],
  templateUrl: './editar-blog.component.html',
  styleUrls: ['./editar-blog.component.css']
})
export class EditarBlogComponent implements OnInit {
  blogForm!: FormGroup;
  blogId!: number;
  categorias: CategoriaBlog[] = [];
  private fb = inject(FormBuilder);
  private blogService = inject(BlogService);
  private categoriaBlogService = inject(CategoriaBlogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private _snackBar = inject(MatSnackBar);
  idUsuario = 0;

  ngOnInit() {
    this.blogId = this.route.snapshot.params['id'];

    this.blogForm = this.fb.group({
      id: [''],
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      categoriaId: ['', Validators.required],
      estado: ['Publicado']
    });

    this.categoriaBlogService.lista().subscribe({
      next: (response) => {
        this.categorias = response.value;
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
      }
    });

    this.cargarBlog();
  }

  cargarBlog() {
    this.blogService.obtenerBlogPorId(this.blogId).subscribe({
      next: (blog: blog) => {
        this.blogForm.patchValue({
          id: blog.id,
          titulo: blog.titulo,
          idUsuario: blog.idUsuario,
          contenido: blog.contenido,
          categoriaId: blog.categoriaId,
          estado: blog.estado
        });
        this.idUsuario = blog.idUsuario
      },
      error: (error) => {
        console.error('Error al cargar el blog:', error);
      }
    });
  }

  actualizarBlog() {
    if (this.blogForm.valid) {
      const updatedBlog: blog = {
        id: this.blogId,
        titulo: this.blogForm.value.titulo,
        contenido: this.blogForm.value.contenido,
        categoriaId: this.blogForm.value.categoriaId,
        idUsuario: this.idUsuario,
        estado: this.blogForm.value.estado,
        fechaPublicacion: new Date(),
        nombreAutor: '',
        nombreCategoria: ''
      };

      this.blogService.editarBlog(this.blogId, updatedBlog).subscribe({
        next: (response) => {
          this._snackBar.open('Blog actualizado exitosamente', 'Aceptar', { duration: 5000 });
          this.router.navigate(['administrar-blogs']);
        },
        error: (error) => {
          this._snackBar.open('Error al actualizar el blog: ' + error.message, 'Aceptar', { duration: 5000 });
        }
      });
    }
  }

  cancelarEdicion() {
    this.router.navigate(['administrar-blogs']);
  }
}
