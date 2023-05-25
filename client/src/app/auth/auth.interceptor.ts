import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + jwtToken)
      });
      return next.handle(clonedReq);
    } else {
      return next.handle(req);
    }
  }
}
