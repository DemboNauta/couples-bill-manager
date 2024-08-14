import { HttpInterceptorFn } from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Obtener el token del servicio de autenticación
    const authToken = localStorage.getItem("token");

    // Clone the request and add the authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });

    // Pass the cloned request with the updated header to the next handler
    return next(authReq);
}

