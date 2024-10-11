import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../custom/menu/menu.component';
import { textoweb } from '../../interfaces/textoweb';
import { TextowebService } from '../../services/textoweb.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MenuComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  textosWeb: textoweb[] = [];

  constructor(private textowebService: TextowebService) {
    
   }

  ngOnInit(): void {
    this.loadTextosWeb();
  }

  // Cargar los datos de TextosWeb
  loadTextosWeb(): void {
    console.log(this.textosWeb);
    this.textowebService.lista().subscribe(
      (data: textoweb[]) => {
        this.textosWeb = data;
        console.log(this.textosWeb); // Para verificar los datos en la consola
      },
      (error) => {
        console.error('Error al cargar los textos web', error);
      }
    );
  }

  getTextosBySection(section: string): textoweb[] {
    return this.textosWeb.filter(t => t.seccion === section);
  }
}
