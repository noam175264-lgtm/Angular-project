import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from '../store/selectors';

export const guardAuthGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const isLoggedIn$ = store.select(selectIsLoggedIn);
  return isLoggedIn$;
};
