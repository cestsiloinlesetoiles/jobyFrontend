import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const user = authService.getUser();

  // Skip interceptor for authentication endpoints
  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  // Add user information header if user is logged in and request is to our API
  if (user && req.url.startsWith(environment.apiUrl)) {
    // Clone the request and add user identification header
    const authReq = req.clone({
      setHeaders: {
        'X-User-Id': user.id || '',
        'X-User-Email': user.email || ''
      }
    });
    return next(authReq);
  }

  return next(req);
};
