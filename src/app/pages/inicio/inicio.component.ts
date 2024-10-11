import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { blog } from '../../interfaces/blog';
import { MenuComponent } from '../../custom/menu/menu.component';
import { Router } from '@angular/router';
import { AccessoService } from '../../services/accesso.service';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MenuComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  private blogService = inject(BlogService);
  private accessoService = inject(AccessoService);
  public listaBlog: MatTableDataSource<blog> = new MatTableDataSource<blog>();
  public displayedColumns: string[] = ['Titulo', 'Fecha de publicación', 'Autor'];
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.blogService.lista().subscribe({
      next: (data) => {
        if (data.value.length > 0) {
          const autorObservables = data.value.map(blog => 
            this.encontrarAutorPeticion(blog.idUsuario)
          );

          // Ejecuta todas las peticiones en paralelo
          forkJoin(autorObservables).subscribe((nombresAutores) => {
            data.value.forEach((blog, index) => {
              blog.nombreAutor = nombresAutores[index];
            });
            this.listaBlog.data = data.value;
            this.listaBlog.sort = this.sort;
            this.listaBlog.paginator = this.paginator;
          });
        }
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listaBlog.filter = filterValue.trim().toLowerCase();
  }

  onRowClick(row: blog) {
    console.log('Row clicked:', row);
    this.router.navigate(['blog-detalles', row.id]);
  }

  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return new Date(date).toLocaleDateString('es-ES', options);
  }

  encontrarAutorPeticion(id: number): Observable<string> {
    return new Observable<string>((observer) => {
      this.accessoService.obtenerUsuario(id).subscribe(response => {
        if (response.isSuccess && response.usuario?.nombre) {
          observer.next(response.usuario.nombre);
        } else {
          console.error('Error:', response.mensaje);
          observer.next(""); // Envía una cadena vacía en caso de error
        }
        observer.complete();
      });
    });
  }
}
