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
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AccessoService } from '../../services/accesso.service';
import { CategoriaBlog } from '../../interfaces/categoriaBlog';
import { CategoriaBlogService } from '../../services/categoria-blog.service';


@Component({
  selector: 'app-blog-categoria',
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
  templateUrl: './blog-categoria.component.html',
  styleUrls: ['./blog-categoria.component.css']
})
export class BlogCategoriaComponent implements AfterViewInit {
  private blogService = inject(BlogService);
  private accessoService = inject(AccessoService);
  private categoriaBlogService = inject(CategoriaBlogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public listaBlog: MatTableDataSource<blog> = new MatTableDataSource<blog>();
  public displayedColumns: string[] = ['Titulo', 'Fecha de publicación', 'Autor'];
  public categoria: CategoriaBlog | null = null;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.route.params.subscribe(params => {
       const categoriaId= this.route.snapshot.params['id'];

       this.categoriaBlogService.obtenerCategoriaPorId(categoriaId).subscribe({
        next: (categoriaData) => {
          this.categoria = categoriaData;
          console.log('Categoría cargada:', this.categoria);
        },
        error: (error) => console.error('Error al obtener la categoría:', error)
      });
      
      this.blogService.obtenerBlogPorCategoriaId(categoriaId).subscribe({
        next: (data) => {
          if (data.value.length > 0) {
            const autorObservables = data.value.map(blog => this.encontrarAutorPeticion(blog.idUsuario));

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
    });
  }

  ngAfterViewInit() {
    this.listaBlog.paginator = this.paginator;
    this.listaBlog.sort = this.sort;
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
