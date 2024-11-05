import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { CreseService } from '../../services/crese.service';
import { Crese } from '../../interfaces/crese';
import { MenuComponent } from '../../custom/menu/menu.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crese',
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
  templateUrl: './crese.component.html',
  styleUrls: ['./crese.component.css']
})
export class CreseComponent implements AfterViewInit {
  private creseService = inject(CreseService);
  public listaCrese: MatTableDataSource<Crese> = new MatTableDataSource<Crese>();
  public displayedColumns: string[] = ['Titulo', 'Texto', 'Video URL'];
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    // Llamar al servicio para obtener la lista de registros Crese
    this.creseService.lista().subscribe({
      next: (data) => {
        this.listaCrese.data = data.value; // Asumimos que data.value es el array de registros Crese
        this.listaCrese.sort = this.sort;
        this.listaCrese.paginator = this.paginator;
      },
      error: (error) => {
        console.error('Error al obtener la lista de Crese:', error.message);
      }
    });
  }

  ngAfterViewInit() {
    this.listaCrese.sort = this.sort;
    this.listaCrese.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listaCrese.filter = filterValue.trim().toLowerCase();
  }

  onRowClick(row: Crese) {
    console.log('Fila seleccionada:', row);
    this.router.navigate(['crese-detalles', row.id]); // Redirige a una página de detalles de Crese
  }

  crearCrese() {
    this.router.navigate(['crese-crear']); // Redirige a una página para crear un nuevo registro Crese
  }
}
