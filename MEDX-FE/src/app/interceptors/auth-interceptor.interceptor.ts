import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const newHeaders = req.clone({
    setHeaders: {
      Authorization: 'Bearer ' + token,
    },
  });
  return next(newHeaders);
};
