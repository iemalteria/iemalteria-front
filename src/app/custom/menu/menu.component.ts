import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { routes } from '../routes';
import { Router } from '@angular/router';
import { AccessoService } from '../../services/accesso.service';
import { catchError, map, of } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { responseUsuarioToken } from '../../interfaces/responseUsuarioToken';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, CommonModule,MatToolbarModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  hasToken: boolean = false;
  routes: Array<any> = routes;
  token: string = localStorage.getItem("token") || "";
  accesoService: AccessoService = inject(AccessoService);
  idUsuario: number = 0;
  public nombreAutor?: string;
  public correoAutor?: string;
  public rolUsuario?: string;
  filteredRoutes: Array<any> = [];

  private router = inject(Router);
  navigateTo(ruta:string)
  { 
    //if(this.token !== "" && ruta=== "logout")
    //{
      //localStorage.removeItem('token');
      //this.token = localStorage.getItem("token") || "";
    //}
    if(ruta==="logout")
    {
    localStorage.removeItem('token');
    }

    this.checkToken();

    this.router.navigate([ruta])
   
  }

  ngOnInit() {
    this.checkToken();
  }
  
  async checkToken() {
    this.hasToken = await this.validarToken();
    if (this.hasToken) {
      this.accesoService.obtenerInformacionUsuario().subscribe({
        next: (response: responseUsuarioToken) => {
          if (response.isSuccess && response.usuario?.id) {
            this.idUsuario = response.usuario.id;
            if (this.idUsuario !== undefined) {
              this.accesoService.obtenerUsuario(this.idUsuario).subscribe(response => {
                if (response.isSuccess) {
                  const usuario = response.usuario;
                  if (usuario?.nombre && usuario?.correo) {
                    this.nombreAutor = usuario.nombre;
                    this.correoAutor = usuario.correo;
                  }
                  this.rolUsuario = usuario?.rol; // Asignar el rol del usuario
                  this.filterRoutes(); // Filtrar rutas según el rol del usuario
                } else {
                  console.error('Error:', response.mensaje);
                }
              });
            }
          } else {
            console.error('Error al obtener la información del usuario:', response.mensaje);
          }
        },
        error: (error) => {
          console.error('Error al obtener la información del usuario:', error.message);
        }
      });
    } else {
      this.filteredRoutes = this.routes; // Si no hay token, mostrar todas las rutas generales
    }
  }

  filterRoutes() {
    this.filteredRoutes = this.routes.filter(route => {
      const hasRole = route.allowedRoles.length === 0 || (this.rolUsuario && route.allowedRoles.includes(this.rolUsuario));
      return (!route.requiresToken || this.hasToken) && hasRole;
    });
  }
  async validarToken(): Promise<boolean> {
    return this.accesoService.validarToken(this.token).pipe(
      map(data => {
        console.log(data.isSuccess ? "True" : "False");
        return data.isSuccess;
      }),
      catchError(error => {
        console.log(error.message);
        return of(false);
      })
    ).toPromise()
    .then(result => result !== undefined ? result : false);
  }

  
  
  
}
