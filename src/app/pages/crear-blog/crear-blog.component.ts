import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../custom/menu/menu.component';
import { BlogService } from '../../services/blog.service';
import { blog } from '../../interfaces/blog';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuillModule } from 'ngx-quill';
import { AccessoService } from '../../services/accesso.service';
import { responseUsuario } from '../../interfaces/responseUsuario';
import { responseUsuarioToken } from '../../interfaces/responseUsuarioToken';
import { MatCardModule } from '@angular/material/card';



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
    MatCardModule
  ]
})
export class CrearBlogComponent {
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private accessoService = inject(AccessoService);
  private blogService = inject(BlogService);

  

  contenido: string = '';
  titulo: string = '';
  idUsuario: number = 0;

  constructor() { 
    this.accessoService.obtenerInformacionUsuario().subscribe({
      next: (response: responseUsuarioToken) => {
        if (response.isSuccess && response.usuario?.id) {
          this.idUsuario = response.usuario.id;
        } else {
          console.error('Error al obtener la información del usuario:', response.mensaje);
          // Manejo de errores
        }
      },
      error: (error) => {
        console.error('Error al obtener la información del usuario:', error.message);
        // Manejo de errores
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
        nombreAutor: '' // Puede actualizarse más adelante
      };
      if(nuevoBlog.contenido!== undefined && nuevoBlog.contenido !== ""){
      this.blogService.crearBlog(nuevoBlog).subscribe({
        next: (response) => {
          let snackBarRef = this._snackBar.open('Blog creado exitosamente: ' + response.titulo, 'Aceptar', { duration: 5000 });
          this.router.navigate(['inicio']);
        },
        error: (error) => {
          let snackBarRef = this._snackBar.open('Error al crear el blog: ' + error.message, 'Aceptar', { duration: 5000 });
          // Manejo de errores
        }
      });
    }
    else
    {
      let snackBarRef = this._snackBar.open('Diligencie el titulo y el contenido del blog', 'Aceptar', { duration: 5000 });
    }
    }
  }
}
