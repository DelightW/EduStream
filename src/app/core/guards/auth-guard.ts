import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { ApiService } from '../services/api';

export const authGuard: CanActivateFn = (route, state) => {
  const apiService = inject(ApiService);
  const router = inject(Router);
  const user = apiService.getUser();

  if (user && user.length > 0) {
    return true;
  } else {
    return router.createUrlTree(['/auth']);
  }
};
