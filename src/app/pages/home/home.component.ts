import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../custom/menu/menu.component';
import { textoweb } from '../../interfaces/textoweb';
import { TextowebService } from '../../services/textoweb.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Crese } from '../../interfaces/crese';
import { CreseImagenes } from '../../interfaces/creceImagenes';
import { CreseService } from '../../services/crese.service';
import { CreseImagenesService } from '../../services/crese-imagenes.service';
import { MatDialog } from '@angular/material/dialog';
import { VideoDialogComponent } from '../video-dialog/video-dialog.component';
import {MatMenuModule} from '@angular/material/menu';
import { CategoriaBlog } from '../../interfaces/categoriaBlog';
import { CategoriaBlogService } from '../../services/categoria-blog.service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { VisitasService } from '../../services/visitas.service';
import { responseVisita } from '../../interfaces/responseVisita';
import { Visita } from '../../interfaces/visita';
import { ComentariosComponent } from '../comentarios/comentarios.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MenuComponent, CommonModule, MatCardModule, MatIconModule, MatMenuModule, MatButtonModule, ComentariosComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  textosWeb: textoweb[] = [];
  creseList: Crese[] = [];
  creseImages: { [key: number]: CreseImagenes[] } = {}; // Almacena imágenes por ID de Crese
  imagenActual: { [key: number]: number } = {}; // Almacena el índice de la imagen actual para cada Crese
  categorias: CategoriaBlog[] = []; // Agrega una propiedad para las categorías
  visitas: Visita[] = [];
  contadorVisitas: number = 0;
  nuevaVisita: Omit<Visita, 'id' | 'fechaVisita'> = {
    pagina: 'Home',  // Asigna el nombre de la página
    ipUsuario: 'xxx',           // Inicialmente vacío, lo llenamos después
    navegador: '',     // Inicialmente vacío, lo llenamos después
  };
  private router = inject(Router);
  http: any;

  constructor(private textowebService: TextowebService, private creseService: CreseService, private creseImagenesService: CreseImagenesService, private dialog: MatDialog, private categoriaBlogService: CategoriaBlogService, private visitasService: VisitasService) {}

  ngOnInit(): void {
    this.loadTextosWeb();
    this.cargarCrese();
    this.cargarCategorias(); // Carga las categorías al iniciar
    this.crearVisita();
    this.cargarVisitas();
    
  }
  crearVisita(): void {
    this.nuevaVisita.navegador = navigator.userAgent;
    this.visitasService.createVisita(this.nuevaVisita).subscribe({
      next: (visitaCreada) => {
        console.log('Visita creada:', visitaCreada);
       
      },
      error: (err) => {
        console.error('Error al crear la visita:', err);
      }
    });
  }

  cargarVisitas(): void {
    this.visitasService.getVisitas().subscribe({
      next: (visitas) => {
        this.visitas = visitas.value;
        this.contadorVisitas = this.visitas.length;
      },
      error: (err) => {
        console.error('Error al obtener las visitas:', err);
      }
    });
  }

  loadTextosWeb(): void {
    console.log(this.textosWeb);
    this.textowebService.lista().subscribe(
      (data: textoweb[]) => {
        this.textosWeb = data;
        console.log(this.textosWeb);
      },
      (error) => {
        console.error('Error al cargar los textos web', error);
      }
    );
  }
  filtrarBlogsPorCategoria(categoria: CategoriaBlog): void {
    console.log('Filtrando por categoría:', categoria);
    this.router.navigate(['blog-categoria', categoria.id]);
    // Implementa aquí la lógica para filtrar los blogs según la categoría seleccionada
  }

  cargarCrese(): void {
    this.creseService.lista().subscribe({
      next: (response) => {
        this.creseList = response.value;
        this.creseList.forEach(crese => {
          this.cargarImagenes(crese.id);
          this.imagenActual[crese.id] = 0; // Inicializa el índice de la imagen actual en 0
        });
      },
      error: (err) => {
        console.error('Error loading Crese list', err);
      }
    });
  }

  cargarImagenes(creseId: number): void {
    this.creseImagenesService.obtenerCreseImagenPorCreseId(creseId).subscribe({
      next: (response) => {
        this.creseImages[creseId] = response.value;
      },
      error: (err) => {
        console.error(`Error loading images for Crese ID ${creseId}`, err);
      }
    });
  }

  cargarCategorias(): void {
    this.categoriaBlogService.lista().subscribe({
      next: (response) => {
        this.categorias = response.value; // Asegúrate de que esto se ajuste a la estructura de tu respuesta
      },
      error: (err) => {
        console.error('Error loading blog categories', err);
      }
    });
  }

  getTextosBySection(section: string): textoweb[] {
    return this.textosWeb.filter(t => t.seccion === section);
  }

  siguienteImagen(creseId: number): void {
    if (this.creseImages[creseId]?.length) {
      this.imagenActual[creseId] = (this.imagenActual[creseId] + 1) % this.creseImages[creseId].length;
    }
  }

  anteriorImagen(creseId: number): void {
    if (this.creseImages[creseId]?.length) {
      this.imagenActual[creseId] = (this.imagenActual[creseId] - 1 + this.creseImages[creseId].length) % this.creseImages[creseId].length;
    }
  }

  mostrarVideo(url: string) {
    this.dialog.open(VideoDialogComponent, {
      data: { videoUrl: url },
      width: '600px'
    });
  }
}
