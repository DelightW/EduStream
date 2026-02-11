import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';    
import {catchError, timeout, finalize} from 'rxjs/operators';
import { AlertService } from '../services/alert.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private alertService: AlertService) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An unknown error occurred!';

                if (error.error instanceof ErrorEvent) {

                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    switch (error.status){
                        case 404:
                            errorMessage = 'Resource not found.';
                            break;
                        case 500:
                            errorMessage = 'Internal server error.';
                            break;
                        case 0:
                            errorMessage = `Cannot connect to server. Please check your network connection.`;
                            break;
                    }
                }
                this.alertService.error('Oops', errorMessage);

                return throwError(() => new Error(errorMessage));
            })
        );
    }
}