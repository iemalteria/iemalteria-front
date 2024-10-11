import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../interfaces/producto';
import { MenuComponent } from '../../custom/menu/menu.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tienda-productos',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatSortModule, ReactiveFormsModule, MenuComponent, CommonModule],
  templateUrl: './tienda-productos.component.html',
  styleUrls: ['./tienda-productos.component.css']
})
export class TiendaProductosComponent implements AfterViewInit {
  private productosService = inject(ProductosService);
  public listaProductos: MatTableDataSource<Producto> = new MatTableDataSource<Producto>();
  public displayedColumns: string[] = ['Id','Nombre', 'Imagen URL', 'Descripción', 'Precio'];
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.productosService.lista().subscribe({
      next: (data) => {
        this.listaProductos.data = data.value; // Assuming data.value is the array of productos
        this.listaProductos.sort = this.sort;
        this.listaProductos.paginator = this.paginator;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  ngAfterViewInit() {
    this.listaProductos.sort = this.sort;
    this.listaProductos.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listaProductos.filter = filterValue.trim().toLowerCase();
  }

  onRowClick(row: Producto) {
    console.log('Row clicked:', row);
    this.router.navigate(['producto-detalles', row.id]);
  }

  crearProducto() {
    this.router.navigate(['producto-crear']); // Redirige a una página para crear un nuevo producto
  }
}
