import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessoService } from '../../services/accesso.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { responseUsuario } from '../../interfaces/responseUsuario';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { MenuComponent } from '../../custom/menu/menu.component';
@Component({
  selector: 'app-usuarios-detalles',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatCardModule, CommonModule, MatButtonModule, ReactiveFormsModule, MenuComponent, MatSelectModule],
  templateUrl: './usuarios-detalles.component.html',
  styleUrls: ['./usuarios-detalles.component.css']
})
export class UsuariosDetallesComponent implements OnInit {
  usuarioForm!: FormGroup;
  usuarioId!: number;
  private fb = inject(FormBuilder);
  private usuariosService = inject(AccessoService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.usuarioId = this.route.snapshot.params['id'];

    this.usuarioForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required],
      // Añadir más campos según la estructura de tu interfaz Usuarios
    });

    this.cargarUsuario();
  }

  cargarUsuario() {
    this.usuariosService.obtenerUsuario(this.usuarioId).subscribe((usuario: responseUsuario) => {
      this.usuarioForm.patchValue({
        id: usuario.usuario?.id,
        nombre: usuario.usuario?.nombre,
        correo: usuario.usuario?.correo,
        rol: usuario.usuario?.rol,
      });
    });
  }

  actualizarUsuario() {
    if (this.usuarioForm.valid) {
      this.usuariosService.editarUsuario(this.usuarioId, this.usuarioForm.value).subscribe({
        next: () => {
          console.log('Usuario actualizado correctamente');
          this.router.navigate(['/administrar']); // Redirige a la lista de usuarios
        },
        error: (error) => {
          console.error('Error al actualizar el usuario:', error);
        }
      });
    }
  }

  
}
