import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoriaBlogService } from '../../services/categoria-blog.service';
import { CategoriaBlog } from '../../interfaces/categoriaBlog'; // Asegúrate de que tienes esta interfaz
import { MenuComponent } from '../../custom/menu/menu.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria-blog-listar',
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
    MenuComponent,
    CommonModule
  ],
  templateUrl: './categoria-blog-listar.component.html',
  styleUrls: ['./categoria-blog-listar.component.css']
})
export class CategoriaBlogListarComponent implements AfterViewInit {
  private categoriaBlogService = inject(CategoriaBlogService);
  public listaCategorias: MatTableDataSource<CategoriaBlog> = new MatTableDataSource<CategoriaBlog>();
  public displayedColumns: string[] = ['nombre', 'descripcion', 'activo', 'acciones'];
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    // Llamar al servicio para obtener la lista de categorías
    this.categoriaBlogService.lista().subscribe({
      next: (data) => {
        this.listaCategorias.data = data.value; // Asumimos que data.value es el array de categorías
        this.listaCategorias.sort = this.sort;
        this.listaCategorias.paginator = this.paginator;
      },
      error: (error) => {
        console.error('Error al obtener la lista de categorías:', error.message);
      }
    });
  }

  ngAfterViewInit() {
    this.listaCategorias.sort = this.sort;
    this.listaCategorias.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listaCategorias.filter = filterValue.trim().toLowerCase();
  }

  onRowClick(row: CategoriaBlog) {
    console.log('Fila seleccionada:', row);
    this.router.navigate(['categoria-blog-detalles', row.id]); // Redirige a una página de detalles de la categoría
  }

  crearCategoria() {
    this.router.navigate(['categoria-blog-crear']); // Redirige a una página para crear una nueva categoría
  }
}
