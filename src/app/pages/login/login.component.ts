import { Component, inject, OnInit } from '@angular/core';
import { AccessoService } from '../../services/accesso.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { login } from '../../interfaces/login';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { routes } from '../../custom/routes';
import { MenuComponent } from '../../custom/menu/menu.component';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatMenuModule, MatIconModule, CommonModule, MenuComponent,MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  token: string = localStorage.getItem("token") || "";
  routes: Array<any> = routes;
  private accesoService = inject(AccessoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);
  hasToken: boolean = false;


  public formLogin: FormGroup = this.formBuild.group({
    correo:['',Validators.required],
    clave: ['',Validators.required]

  })

  iniciarSesion(){
    if(this.formLogin.invalid) return;

    const objeto: login = {
      correo: this.formLogin.value.correo,
      clave: this.formLogin.value.clave
    }

    this.accesoService.login(objeto).subscribe({
      next:(data) => {
        if(data.isSuccess){
          localStorage.setItem("token", data.token)
          this.router.navigate(["inicio"])
        }else{
          let snackBarRef = this. _snackBar.open('Las credenciales son incorrectas', 'Aceptar', {duration: 5000});
        }
      },
      error:(error) => {
        console.log(error.message);
      }
    })
  }

  registrarse()
  {
    this.router.navigate(['registro']);
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
