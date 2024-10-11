import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../custom/menu/menu.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { EmpleadoService } from '../../services/empleado.service';
import { empleado } from '../../interfaces/empleado';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { VideoDialogComponent } from '../video-dialog/video-dialog.component';
export interface ExampleTab {
  label: string;
  content: string;
}

@Component({
  selector: 'app-conocenos',
  standalone: true,
  imports: [MenuComponent, MatTabsModule, AsyncPipe, MatCardModule, CommonModule, MatDialogModule],
  templateUrl: './conocenos.component.html',
  styleUrls: ['./conocenos.component.css']
})
export class ConocenosComponent implements OnInit {
  asyncTabs: Observable<ExampleTab[]>;
  empleadosSedeMalteria: empleado[] = [];
  empleadosSedeColonia: empleado[] = [];
  empleadosSedePorvenir: empleado[] = [];
  selectedTabIndex: number = 0; // Índice de la pestaña seleccionada
  videoUrl: SafeResourceUrl | null = null;
  videoVisible: boolean = false;

  constructor(private empleadoService: EmpleadoService, private sanitizer: DomSanitizer, private dialog: MatDialog) {
    this.asyncTabs = of([
      { label: 'Sede Principal Malteria', content: 'Content 1' },
      { label: 'Sede La Colonia', content: 'Content 2' },
      { label: 'Sede B Porvenir', content: 'Content 3' },
    ]);
  }

  ngOnInit() {
    // Cargar empleados por sede
    this.cargarEmpleadosPorSede();
  }

  cargarEmpleadosPorSede() {
    this.empleadoService.lista().subscribe((empleados) => {
      this.empleadosSedeMalteria = empleados.value.filter(emp => emp.sede === 'Sede Malteria');
      this.empleadosSedeColonia = empleados.value.filter(emp => emp.sede === 'Sede Colonia');
      this.empleadosSedePorvenir = empleados.value.filter(emp => emp.sede === 'Sede Porvenir');
    });
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }

  mostrarVideo(url: string) {
    this.dialog.open(VideoDialogComponent, {
      data: { videoUrl: url },
      width: '600px'
    });
  }
}
