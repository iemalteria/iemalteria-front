import { Component, inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../custom/menu/menu.component';
import { BlogService } from '../../services/blog.service';
import { CategoriaBlogService } from '../../services/categoria-blog.service';
import { blog } from '../../interfaces/blog';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuillModule } from 'ngx-quill';
import { AccessoService } from '../../services/accesso.service';
import { responseUsuarioToken } from '../../interfaces/responseUsuarioToken';
import { MatCardModule } from '@angular/material/card';
import { CategoriaBlog } from '../../interfaces/categoriaBlog';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-crear-blog',
  templateUrl: './crear-blog.component.html',
  styleUrls: ['./crear-blog.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    MenuComponent,
    MatIconModule,
    MatSnackBarModule,
    QuillModule,
    MatCardModule,
    MatSelectModule
  ]
})
export class CrearBlogComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private accessoService = inject(AccessoService);
  private blogService = inject(BlogService);
  private categoriaBlogService = inject(CategoriaBlogService);

  contenido: string = '';
  titulo: string = '';
  idUsuario: number = 0;
  categoriaId: number = 0;
  categorias: CategoriaBlog[] = []; // Propiedad para almacenar las categorías

  constructor() {
    this.accessoService.obtenerInformacionUsuario().subscribe({
      next: (response: responseUsuarioToken) => {
        if (response.isSuccess && response.usuario?.id) {
          this.idUsuario = response.usuario.id;
        } else {
          console.error('Error al obtener la información del usuario:', response.mensaje);
        }
      },
      error: (error) => {
        console.error('Error al obtener la información del usuario:', error.message);
      }
    });
  }

  ngOnInit(): void {
    this.categoriaBlogService.lista().subscribe({
      next: (response) => {
        this.categorias = response.value; // Asigna el array de categorías de la respuesta
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error.message);
      }
    });
  }

  onSubmit(blogForm: any): void {
    if (blogForm.valid) {
      const nuevoBlog: Omit<blog, 'id'> = {
        titulo: this.titulo,
        contenido: this.contenido,
        idUsuario: this.idUsuario,
        fechaPublicacion: new Date(),
        estado: 'Publicado',
        nombreAutor: '',
        categoriaId: this.categoriaId,
        nombreCategoria: ''
      };

      if (nuevoBlog.contenido !== undefined && nuevoBlog.contenido !== "") {
        this.blogService.crearBlog(nuevoBlog).subscribe({
          next: (response) => {
            this._snackBar.open('Blog creado exitosamente: ' + response.titulo, 'Aceptar', { duration: 5000 });
            this.router.navigate(['inicio']);
          },
          error: (error) => {
            this._snackBar.open('Error al crear el blog: ' + error.message, 'Aceptar', { duration: 5000 });
          }
        });
      } else {
        this._snackBar.open('Diligencie el titulo y el contenido del blog', 'Aceptar', { duration: 5000 });
      }
    }
  }
}
