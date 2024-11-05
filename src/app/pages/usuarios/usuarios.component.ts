import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { AccessoService } from '../../services/accesso.service';
import { responseUsuario, responseUsuarios } from '../../interfaces/responseUsuario';
import { Router } from '@angular/router';
import { usuario } from '../../interfaces/usuario';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements AfterViewInit {
  private accessoService = inject(AccessoService);
  public listaUsuarios: MatTableDataSource<usuario> = new MatTableDataSource<usuario>();
  public displayedColumns: string[] = ['Nombre', 'Email', 'Rol'];
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    // Llamar al servicio para obtener la lista de usuarios
    this.accessoService.obtenerTodosUsuarios().subscribe({
      next: (data) => {
        this.listaUsuarios.data= data.value; // Asumiendo que data es el array de usuarios
        this.listaUsuarios.sort = this.sort;
        this.listaUsuarios.paginator = this.paginator;
      },
      error: (error) => {
        console.error('Error al obtener la lista de usuarios:', error.message);
      }
    });
  }

  ngAfterViewInit() {
    this.listaUsuarios.sort = this.sort;
    this.listaUsuarios.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listaUsuarios.filter = filterValue.trim().toLowerCase();
  }

  onRowClick(row: usuario) {
    console.log('Usuario seleccionado:', row);
    this.router.navigate(['usuarios-detalles', row.id]); // Redirige a una página de detalles de usuario
  }

  crearUsuario() {
    this.router.navigate(['usuarios-crear']); // Redirige a una página para crear un nuevo usuario
  }
}
