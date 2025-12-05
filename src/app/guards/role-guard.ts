import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles: string[] = route.data['roles'] || [];

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const userRoles = authService.getAuthorities();
  const hasRole = expectedRoles.some((role) => userRoles.includes(role));

  if (!hasRole) {
    router.navigate(['/not-authorized']);
    return false;
  }

  return true;
};
