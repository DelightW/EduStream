import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  private baseUrl = environment.apiUrl;

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