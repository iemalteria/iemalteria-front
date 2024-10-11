import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { blog } from '../../interfaces/blog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../custom/menu/menu.component';
import { AccessoService } from '../../services/accesso.service';

@Component({
  selector: 'app-blog-detalles',
  standalone: true,
  imports: [MatCardModule, CommonModule, MenuComponent],
  templateUrl: './blog-detalles.component.html',
  styleUrls: ['./blog-detalles.component.css']
})
export class BlogDetallesComponent implements OnInit {
  public blog?: blog;
  public safeContenido?: SafeHtml;
  public nombreAutor?: string;
  public correoAutor?: string;
  
  constructor(
    private route: ActivatedRoute, 
    private blogService: BlogService,
    private sanitizer: DomSanitizer,
    private accesoService: AccessoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogService.obtenerBlogPorId(Number(id)).subscribe(data => {
        this.blog = data;
        if (this.blog?.contenido) {
          this.safeContenido = this.sanitizer.bypassSecurityTrustHtml(this.blog.contenido);
          if (this.blog?.idUsuario !== undefined) {
            this.accesoService.obtenerUsuario(this.blog.idUsuario).subscribe(response => {
              if (response.isSuccess) {
                console.log('Usuario:', response.usuario);
                if (response.usuario?.nombre !== undefined && response.usuario?.correo !== undefined) {
                  this.nombreAutor = response.usuario.nombre;
                  this.correoAutor = response.usuario.correo;
                }
              } else {
                console.error('Error:', response.mensaje);
              }
            });
          }
        }
      });
    }
  }
}
