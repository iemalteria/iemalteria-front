import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccessoService } from '../services/accesso.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem("token") || "";
  const router = inject(Router);
  const accesoService = inject(AccessoService);

  if (token !== "") {
    return accesoService.validarToken(token).pipe(
      map(data => {
        if (data.isSuccess) {
          return true;
        } else {
          router.navigate(['']);
          return false;
        }
      }),
      catchError(error => {
        router.navigate(['']);
        return of(false);
      })
    );
  } else {
    router.navigateByUrl("");
    return of(false); // Corregido para devolver un observable
  }
};
