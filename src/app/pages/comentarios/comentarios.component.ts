import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comentario } from '../../interfaces/comentario';
import { ComentarioService } from '../../services/comentario.service';
import { AccessoService } from '../../services/accesso.service';
import { responseUsuarioToken } from '../../interfaces/responseUsuarioToken';
import { responseUsuario } from '../../interfaces/responseUsuario';
import { Respuesta } from '../../interfaces/respuesta';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css'],
})
export class ComentariosComponent implements OnInit {
  comentarios: Comentario[] = [];
  comentarioForm: FormGroup;
  respuestaForm: FormGroup;
  comentarioService = inject(ComentarioService);
  accesoService = inject(AccessoService);
  usuarioId: number | null = null;
  esAdministrador = false;

  constructor(
    private fb: FormBuilder
  ) {
    this.comentarioForm = this.fb.group({
      texto: ['', [Validators.required, Validators.maxLength(500)]],
    });

    this.respuestaForm = this.fb.group({
      texto: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    this.obtenerInformacionUsuario();
    this.cargarComentarios();
  }

  obtenerInformacionUsuario(): void {
    this.accesoService.obtenerInformacionUsuario().subscribe({
      next: (response: responseUsuarioToken) => {
        if (response.isSuccess && response.usuario) {
          this.usuarioId = response.usuario.id;
          this.accesoService.obtenerUsuario(this.usuarioId).subscribe({
            next: (response: responseUsuario) => {
              if (response.isSuccess)
              {
                this.esAdministrador = response.usuario?.rol === 'Administrador';
              }
            }
          })
        }
      },
      error: (err) => console.error('Error al obtener la información del usuario', err),
    });
  }

  cargarComentarios(): void {
    this.comentarioService.obtenerComentarios().subscribe({
      next: (response) => {
        this.comentarios = response.value;

        // Cargar datos del autor y respuestas para cada comentario
        this.comentarios.forEach((comentario) => {
          this.cargarDatosAutor(comentario);
          this.cargarRespuestas(comentario);
        });
      },
      error: (err) => console.error('Error al cargar los comentarios', err),
    });
  }

  cargarDatosAutor(comentario: Comentario): void {
    this.accesoService.obtenerUsuario(comentario.usuarioId).subscribe({
      next: (response: responseUsuario) => {
        if (response.isSuccess && response.usuario) {
          comentario.autor = response.usuario.nombre; // Añadimos el nombre del autor
        }
      },
      error: (err) => console.error('Error al cargar datos del autor', err),
    });
  }

  cargarRespuestas(comentario: Comentario): void {
    this.comentarioService.obtenerRespuestas(comentario.id).subscribe({
      next: (respuestas) => {
        respuestas.value.forEach((respuesta) => {
          // Cargar datos del autor de cada respuesta
          this.accesoService.obtenerUsuario(respuesta.usuarioId).subscribe({
            next: (response: responseUsuario) => {
              if (response.isSuccess && response.usuario) {
                respuesta.autor = response.usuario.nombre;
              }
            },
            error: (err) => console.error('Error al cargar datos del autor de la respuesta', err),
          });
        });
        comentario.respuestas = respuestas.value;
      },
      error: (err) => console.error('Error al cargar respuestas', err),
    });
  }

  enviarComentario(): void {
    if (this.comentarioForm.invalid || !this.usuarioId) {
      return;
    }

    const fechaBogota = new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' });
    const nuevoComentario: Comentario = {
      id: 0,
      texto: this.comentarioForm.value.texto,
      fecha: new Date(fechaBogota).toISOString(),
      usuarioId: this.usuarioId,
      respuestas: [],
      autor: '', // Esto se cargará al recargar los comentarios
    };

    this.comentarioService.crearComentario(nuevoComentario).subscribe({
      next: () => {
        this.cargarComentarios();
        this.comentarioForm.reset();
      },
      error: (err) => console.error('Error al enviar el comentario', err),
    });
  }

  enviarRespuesta(comentarioId: number): void {
    if (this.respuestaForm.invalid || !this.usuarioId) {
      return;
    }
    const fechaBogota = new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' });
    const nuevaRespuesta: Respuesta = {
      id: 0,
      comentarioId,
      texto: this.respuestaForm.value.texto,
      fecha: new Date(fechaBogota).toISOString(),
      usuarioId: this.usuarioId,
      autor: '', // Esto se cargará al recargar las respuestas
    };

    this.comentarioService.crearRespuesta(nuevaRespuesta.comentarioId, nuevaRespuesta).subscribe({
      next: () => {
        this.cargarRespuestas({ id: comentarioId, texto: '', fecha: '', usuarioId: 0, respuestas: [] });
        this.comentarios.forEach((comentario) => {
          this.cargarDatosAutor(comentario);
          this.cargarRespuestas(comentario);
        });
        this.respuestaForm.reset();
      },
      error: (err) => console.error('Error al enviar la respuesta', err),
    });
  }

  eliminarComentario(comentarioId: number): void {
    this.comentarioService.eliminarComentario(comentarioId).subscribe({
      next: () => this.cargarComentarios(),
      error: (err) => console.error('Error al eliminar comentario', err),
    });
  }

  eliminarRespuesta(respuestaId: number, comentarioId: number): void {
    this.comentarioService.eliminarRespuesta(respuestaId).subscribe({
      next: () => this.cargarRespuestas(this.comentarios.find((c) => c.id === comentarioId)!),
      error: (err) => console.error('Error al eliminar respuesta', err),
    });
  }

  puedeEliminar(usuarioId: number): boolean {
    return this.esAdministrador || this.usuarioId === usuarioId;
  }
}
