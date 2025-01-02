import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appsettings } from '../settings/appsettings';
import { Visita } from '../interfaces/visita';
import { responseVisita } from '../interfaces/responseVisita';

// Interfaz para representar una visita


@Injectable({
  providedIn: 'root'
})
export class VisitasService {
  private http = inject(HttpClient);
    private baseUrl: string = appsettings.apiUrl+"Visitas";
  

  constructor() {}

  obtenerIp(): Observable<{ ip: string }> {
    return this.http.get<{ ip: string }>('https://api.ipify.org?format=json');
  }

  // Obtener todas las visitas
  getVisitas(): Observable<responseVisita> {
    return this.http.get<responseVisita>(`${this.baseUrl}`);
  }

  // Obtener una visita por ID
  getVisita(id: number): Observable<Visita> {
    return this.http.get<Visita>(`${this.baseUrl}/${id}`);
  }

  // Crear una nueva visita
  createVisita(visita: Omit<Visita, 'id' | 'fechaVisita'>): Observable<Visita> {
    return this.http.post<Visita>(`${this.baseUrl}`, visita);
  }

  // Eliminar una visita por ID
  deleteVisita(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Filtrar visitas
  filterVisitas(pagina?: string, fechaInicio?: Date, fechaFin?: Date): Observable<Visita[]> {
    let params = new HttpParams();

    if (pagina) {
      params = params.set('pagina', pagina);
    }
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio.toISOString());
    }
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin.toISOString());
    }

    return this.http.get<Visita[]>(`${this.baseUrl}/filter`, { params });
  }
}
