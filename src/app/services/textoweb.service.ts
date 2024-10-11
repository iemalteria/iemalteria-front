  import { HttpClient } from '@angular/common/http';
  import { inject, Injectable } from '@angular/core';
  import { appsettings } from '../settings/appsettings';
  import { Observable } from 'rxjs';
  import { textoweb } from '../interfaces/textoweb';  // Asegúrate de que la ruta sea correcta

  @Injectable({
    providedIn: 'root'
  })
  export class TextowebService {
    private http = inject(HttpClient);
    private baseUrl: string = appsettings.apiUrl;

    constructor() { }

    // Obtener todos los registros de TextosWeb
    lista(): Observable<textoweb[]> {
      return this.http.get<textoweb[]>(`${this.baseUrl}TextosWeb`);
    }

    // Obtener un registro específico por ID
    obtenerTextowebPorId(id: number): Observable<textoweb> {
      return this.http.get<textoweb>(`${this.baseUrl}TextosWeb/${id}`);
    }

    // Actualizar un registro existente
    actualizarTextoweb(id: number, textoweb: textoweb): Observable<void> {
      return this.http.put<void>(`${this.baseUrl}TextosWeb/${id}`, textoweb);
    }

  }
