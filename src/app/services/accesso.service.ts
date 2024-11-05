import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { responseAcceso } from '../interfaces/responseAcceso';
import { usuario } from '../interfaces/usuario';
import { Observable } from 'rxjs';
import { responseBlog } from '../interfaces/responseBlog';
import { login } from '../interfaces/login';
import { responseUsuario, responseUsuarios } from '../interfaces/responseUsuario';
import { responseUsuarioToken } from '../interfaces/responseUsuarioToken';

@Injectable({
  providedIn: 'root'
})
export class AccessoService {
  private http = inject(HttpClient);
  private baseUrl: string = appsettings.apiUrl;

  constructor() { }

  registrarse(objeto: usuario): Observable<responseAcceso> {
    return this.http.post<responseAcceso>(`${this.baseUrl}Acceso/Registrarse`, objeto);
  }

  login(objeto: login): Observable<responseAcceso> {
    return this.http.post<responseAcceso>(`${this.baseUrl}Acceso/Login`, objeto);
  }

  validarToken(token: string): Observable<responseAcceso> {
    return this.http.get<responseAcceso>(`${this.baseUrl}Acceso/ValidarToken?token=${token}`);
  }

  obtenerUsuario(id: number): Observable<responseUsuario> {
    return this.http.get<responseUsuario>(`${this.baseUrl}Usuarios/ObtenerUsuario?id=${id}`);
  }

  obtenerInformacionUsuario(): Observable<responseUsuarioToken> {
    return this.http.get<responseUsuarioToken>(`${this.baseUrl}Usuarios/ObtenerInfoUsuario`);
  }

  obtenerTodosUsuarios(): Observable<responseUsuarios> {
    return this.http.get<responseUsuarios>(`${this.baseUrl}Usuarios/ObtenerTodosUsuarios`);
  }

  editarUsuario(id: number, usuario: usuario): Observable<responseAcceso> {
    return this.http.put<responseAcceso>(`${this.baseUrl}Usuarios/EditarUsuario?id=${id}`, usuario);
  }
}
