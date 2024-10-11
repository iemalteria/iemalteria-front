import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadoService } from '../../services/empleado.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MenuComponent } from '../../custom/menu/menu.component';
import { empleado } from '../../interfaces/empleado';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-empleado-detalles',
  standalone: true,
  imports: [MenuComponent, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './empleado-detalles.component.html',
  styleUrls: ['./empleado-detalles.component.css']
})
export class EmpleadoDetallesComponent implements OnInit {
  empleadoForm!: FormGroup;
  empleadoId!: number;
  private fb = inject(FormBuilder);
  private empleadoService = inject(EmpleadoService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    // Obtén el ID del empleado desde la URL
    this.empleadoId = this.route.snapshot.params['id'];

    // Inicializa el formulario
    this.empleadoForm = this.fb.group({
      nombre: ['', Validators.required],
      imagenUrl: ['', Validators.required],
      videoUrl: ['', Validators.required],
      descripcion: ['', Validators.required],
      sede: ['', Validators.required]
    });

    // Cargar datos del empleado
    this.cargarEmpleado();
  }

  cargarEmpleado() {
    this.empleadoService.obtenerEmpleadoPorId(this.empleadoId).subscribe((empleado: empleado) => {
      this.empleadoForm.patchValue({
        nombre: empleado.nombre,
        imagenUrl: empleado.imagenUrl,
        videoUrl: empleado.videoUrl,
        descripcion: empleado.descripcion,
        sede: empleado.sede
      });
    });
  }

  // Método para guardar los cambios
  actualizarEmpleado() {
    if (this.empleadoForm.valid) {
      this.empleadoService.actualizarEmpleado(this.empleadoId, this.empleadoForm.value).subscribe({
        next: () => {
          this.router.navigate(['/empleados']); // Redirige a la lista de empleados después de actualizar
        },
        error: (error) => {
          console.error('Error al actualizar empleado:', error);
        }
      });
    }
  }

  // Método para eliminar el empleado
  eliminarEmpleado() {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      this.empleadoService.eliminarEmpleado(this.empleadoId).subscribe({
        next: () => {
          this.router.navigate(['/empleados']); // Redirige a la lista de empleados después de eliminar
        },
        error: (error) => {
          console.error('Error al eliminar empleado:', error);
        }
      });
    }
  }

}
