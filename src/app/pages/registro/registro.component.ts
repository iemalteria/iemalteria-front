import { Component, inject } from '@angular/core';

import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccessoService } from '../../services/accesso.service';
import { Router } from '@angular/router';
import { usuario } from '../../interfaces/usuario';
import { MenuComponent } from '../../custom/menu/menu.component';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MenuComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  token: string = localStorage.getItem("token") || "";
  hasToken: boolean = false;
  private accesoService = inject(AccessoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  public formRegistro: FormGroup = this.formBuild.group({
    correo:['',Validators.required],
    nombre:['',Validators.required],
    clave: ['',Validators.required],
    rol: ['Usuario']

  })

  registrarse()
  {
    if(this.formRegistro.invalid) return;

    const objeto: usuario = {
      correo: this.formRegistro.value.correo,
      nombre: this.formRegistro.value.nombre,
      clave: this.formRegistro.value.clave,
      rol: 'Usuario'
    }

    this.accesoService.registrarse(objeto).subscribe({
      next:(data)=>{
        if(data.isSuccess){
          this.router.navigate([''])
        }
        else{
          alert("No se pudo registrar")
        }
      },
      error:(error) => {
        console.log(error.message);
      }
    })
  }

  login()
  {
    this.router.navigate(['']);
  }

  async checkToken() {
    this.hasToken = await this.validarToken();
    if(this.hasToken)
    {
      this.router.navigate(['inicio']);
    }
  }
  async validarToken(): Promise<boolean> {
    return this.accesoService.validarToken(this.token).pipe(
      map(data => {
        console.log(data.isSuccess ? "True" : "False");
        return data.isSuccess;
      }),
      catchError(error => {
        console.log(error.message);
        return of(false);
      })
    ).toPromise()
    .then(result => result !== undefined ? result : false);
  }

  ngOnInit() {
    this.checkToken();
  }

}
