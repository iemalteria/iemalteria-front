import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpleadoService } from '../../services/empleado.service';
import { MenuComponent } from '../../custom/menu/menu.component';
import { empleado } from '../../interfaces/empleado';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-empleado-crear',
  standalone: true,
  imports: [MenuComponent,MatCardModule, ReactiveFormsModule, MatFormFieldModule, CommonModule, MatInputModule, MatSelectModule, MatSnackBarModule, MatButtonModule ],
  templateUrl: './empleado-crear.component.html',
  styleUrls: ['./empleado-crear.component.css']
})
export class EmpleadoCrearComponent {
  empleadoForm: FormGroup;
  sedes: string[] = ['Sede Malteria', 'Sede Colonia', 'Sede Porvenir'];
  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    public router: Router
  ) {
    this.empleadoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      imagenUrl: ['', [Validators.required]],
      videoUrl: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      sede: ['', [Validators.required]]
    });
  }

  get nombre() {
    return this.empleadoForm.get('nombre');
  }

  get sede() {
    return this.empleadoForm.get('sede');
  }

  get imagenUrl() {
    return this.empleadoForm.get('imagenUrl');
  }

  get videoUrl() {
    return this.empleadoForm.get('videoUrl');
  }

  get descripcion() {
    return this.empleadoForm.get('descripcion');
  }

  crearEmpleado() {
    if (this.empleadoForm.valid) {
      const nuevoEmpleado: empleado = this.empleadoForm.value;
      this.empleadoService.crearEmpleado(nuevoEmpleado).subscribe({
        next: () => {
          let snackBarRef = this._snackBar.open('El empleado se ha añadido correctamente', 'Aceptar', { duration: 5000 });
          this.router.navigate(['empleados']);
          
        },
        error: (error) => {
          let snackBarRef = this._snackBar.open('Hay un error al añadir el empleado: ' + error.message, 'Aceptar', { duration: 5000 });
        }
      });
    } else {
      let snackBarRef = this._snackBar.open('Formulario invalido', 'Aceptar', { duration: 5000 });
    }
  }
}
