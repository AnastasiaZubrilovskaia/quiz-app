import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

//Гард маршрутов, который защищает маршруты от несанкционированного доступа
export const authGuard: CanActivateFn = (route, state) => { //тип для функции-гарда (информация о текущем маршруте, состояние маршрутизатора)
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};