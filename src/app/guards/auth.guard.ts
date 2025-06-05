import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthHelperService } from '../services/auth-helper.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authHelperService = inject(AuthHelperService);
  const router = inject(Router);

  if (authHelperService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
