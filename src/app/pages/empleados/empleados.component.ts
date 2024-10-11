import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';
import { empleado } from '../../interfaces/empleado';
import { MenuComponent } from '../../custom/menu/menu.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empleados',
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
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements AfterViewInit {
  private empleadoService = inject(EmpleadoService);
  public listaEmpleados: MatTableDataSource<empleado> = new MatTableDataSource<empleado>();
  public displayedColumns: string[] = ['Nombre', 'Imagen URL', 'Descripción', 'Sede'];
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.empleadoService.lista().subscribe({
      next: (data) => {
        this.listaEmpleados.data = data.value; // Assuming data.value is the array of empleados
        this.listaEmpleados.sort = this.sort;
        this.listaEmpleados.paginator = this.paginator;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  ngAfterViewInit() {
    this.listaEmpleados.sort = this.sort;
    this.listaEmpleados.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listaEmpleados.filter = filterValue.trim().toLowerCase();
  }

  onRowClick(row: empleado) {
    console.log('Row clicked:', row);
    // Puedes redirigir a una página de detalles o realizar otra acción
    this.router.navigate(['empleado-detalles', row.id]);
  }

  crearEmpleado() {
    this.router.navigate(['empleado-crear']); // Redirige a una página para crear un nuevo empleado
  }
}
