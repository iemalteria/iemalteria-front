import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appsettings } from '../settings/appsettings';
import { Comentario } from '../interfaces/comentario';
import { responseComentario } from '../interfaces/responseComentario';
import { responseRespuesta } from '../interfaces/responseRespuesta';
import { Respuesta } from '../interfaces/respuesta';

// Interfaz para Comentario


@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  private http = inject(HttpClient);
  private baseUrl: string = appsettings.apiUrl+"Comentarios";

  constructor() {}

  // Comentarios

  // Obtener todos los comentarios
  obtenerComentarios(): Observable< responseComentario > {
    return this.http.get< responseComentario >(`${this.baseUrl}/comentarios`);
  }

  // Obtener un comentario por ID
  obtenerComentarioPorId(id: number): Observable<Comentario> {
    return this.http.get<Comentario>(`${this.baseUrl}/comentarios/${id}`);
  }

  // Crear un comentario
  crearComentario(comentario: Comentario): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.baseUrl}/comentarios`, comentario);
  }

  // Actualizar un comentario
  actualizarComentario(id: number, comentario: Comentario): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/comentarios/${id}`, comentario);
  }

  // Eliminar un comentario
  eliminarComentario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/comentarios/${id}`);
  }

  // Respuestas

  // Obtener todas las respuestas de un comentario
  obtenerRespuestas(comentarioId: number): Observable<responseRespuesta> {
    return this.http.get<responseRespuesta>(
      `${this.baseUrl}/comentarios/${comentarioId}/respuestas`
    );
  }

  // Crear una respuesta para un comentario
  crearRespuesta(
    comentarioId: number,
    respuesta: Respuesta
  ): Observable<Respuesta> {
    return this.http.post<Respuesta>(
      `${this.baseUrl}/comentarios/${comentarioId}/respuestas`,
      respuesta
    );
  }

  // Actualizar una respuesta
  actualizarRespuesta(id: number, respuesta: Respuesta): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/respuestas/${id}`, respuesta);
  }

  // Eliminar una respuesta
  eliminarRespuesta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/respuestas/${id}`);
  }
}
