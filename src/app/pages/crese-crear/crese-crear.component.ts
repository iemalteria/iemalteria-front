import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreseService } from '../../services/crese.service';
import { MenuComponent } from '../../custom/menu/menu.component';
import { Crese } from '../../interfaces/crese';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-crese-crear',
  standalone: true,
  imports: [
    MenuComponent,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule
  ],
  templateUrl: './crese-crear.component.html',
  styleUrls: ['./crese-crear.component.css']
})
export class CreseCrearComponent {
  creseForm: FormGroup;
  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private creseService: CreseService,
    public router: Router
  ) {
    this.creseForm = this.fb.group({
      titulo: ['', [Validators.required]],
      texto: ['', [Validators.required]],
      videoUrl: ['', [Validators.required]]
    });
  }

  get titulo() {
    return this.creseForm.get('titulo');
  }

  get texto() {
    return this.creseForm.get('texto');
  }

  get videoUrl() {
    return this.creseForm.get('videoUrl');
  }

  crearCrese() {
    if (this.creseForm.valid) {
      const nuevoCrese: Crese = this.creseForm.value;
      this.creseService.crearCrese(nuevoCrese).subscribe({
        next: () => {
          let snackBarRef = this._snackBar.open('El registro de Crese se ha añadido correctamente', 'Aceptar', { duration: 5000 });
          this.router.navigate(['administrar']);
        },
        error: (error) => {
          let snackBarRef = this._snackBar.open('Hay un error al añadir el registro de Crese: ' + error.message, 'Aceptar', { duration: 5000 });
        }
      });
    } else {
      let snackBarRef = this._snackBar.open('Formulario inválido', 'Aceptar', { duration: 5000 });
    }
  }
}
