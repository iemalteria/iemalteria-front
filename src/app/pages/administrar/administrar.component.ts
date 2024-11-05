import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { TextowebService } from '../../services/textoweb.service';
import { textoweb } from '../../interfaces/textoweb';
import { MenuComponent } from '../../custom/menu/menu.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreseComponent } from '../crese/crese.component';
import { UsuariosComponent } from '../usuarios/usuarios.component';

@Component({
  selector: 'app-administrar',
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
    CommonModule,
    CreseComponent,
    UsuariosComponent
  ],
  templateUrl: './administrar.component.html',
  styleUrls: ['./administrar.component.css']
})
export class AdministrarComponent implements AfterViewInit {
  private textowebService = inject(TextowebService);
  public listaTextosWeb: MatTableDataSource<textoweb> = new MatTableDataSource<textoweb>();
  public displayedColumns: string[] = ['Sección', 'Título', 'Texto', 'Imagen URL'];
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.textowebService.lista().subscribe({
      next: (data) => {
        this.listaTextosWeb.data = data;
        this.listaTextosWeb.sort = this.sort;
        this.listaTextosWeb.paginator = this.paginator;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  ngAfterViewInit() {
    this.listaTextosWeb.sort = this.sort;
    this.listaTextosWeb.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listaTextosWeb.filter = filterValue.trim().toLowerCase();
  }

  onRowClick(row: textoweb) {
    console.log('Row clicked:', row);
    // Puedes redirigir a una página de detalles o realizar otra acción
    this.router.navigate(['textos-web-detalles', row.id]);
  }
}
