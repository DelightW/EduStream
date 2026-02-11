import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  private baseUrl = 'http://localhost:3000';

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!request.url.startsWith('http')) {
      const apiReq = request.clone({
        url: `${this.baseUrl}/${request.url}`
      });
      return next.handle(apiReq);
    }
    
    return next.handle(request);
  }
}