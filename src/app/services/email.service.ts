import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private http = inject(HttpClient);
  private baseUrl: string = `${appsettings.apiUrl}Email/enviar-pdf`;

  constructor() {}

  enviarCorreoConPdf(destinatario: string, asunto: string, mensaje: string, archivoPdf: File): Observable<any> {
    const formData: FormData = new FormData();
    
    // Agregar los datos del formulario
    formData.append('destinatario', destinatario);
    formData.append('asunto', asunto);
    formData.append('mensaje', mensaje);
    formData.append('archivoPdf', archivoPdf); // El archivo PDF

    // Opcional: Configurar los headers si es necesario
    const headers = new HttpHeaders({
      'enctype': 'multipart/form-data'
    });

    // Realizar la petición POST al backend
    return this.http.post(this.baseUrl, formData, { headers });
  }
}
