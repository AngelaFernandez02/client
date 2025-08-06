// src/app/interceptors/token.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError, of } from 'rxjs';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Si no hay token, continúa con la petición sin modificar
  if (!token) return next(req);

  // Clona la petición y agrega el token al header
  const cloned = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  // Envía la petición clonada y maneja errores
  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Intenta refrescar el token
        return authService.refreshToken({
          email: authService.getUserDetail()?.email ?? '',
          token: token,
          refreshToken: authService.getrefreshToken() ?? ''
        }).pipe(
          switchMap((response) => {
            if (response.isSuccess && response.token) {
              // Guarda el nuevo token
              localStorage.setItem("user", JSON.stringify(response));
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.token}`
                }
              });

               location.reload();

              return next(newReq);
            } else {
              authService.logout();
              router.navigate(['/login']);
              return throwError(() => error);
            }
          }),
          catchError(() => {
            authService.logout();
            router.navigate(['/login']);
            return throwError(() => error);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
