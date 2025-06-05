import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../model/user.model';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Vérifier si l'utilisateur est connecté
    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    // Vérifier si le rôle de l'utilisateur est autorisé
    const userRole = authService.getCurrentUserRole();
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // Rediriger vers la page d'accueil si non autorisé
    router.navigate(['/home']);
    return false;
  };
};
