import { AuthenticationService } from 'src/app/services/auth/auth-service.service';
import { SharedService } from 'src/app/services/shared.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { AlertService } from '../services/alert/alert.service';



@Injectable()


export class JwtInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthenticationService, private alert : AlertService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = this.addToken(request);

    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
              switchMap(() => {
                request = this.addToken(request);
                return next.handle(request);
              }),
              catchError((err) => {
                this.isRefreshing = false;
                return this.handleError(err);
              }),
              finalize(() => {
                this.isRefreshing = false;
              })
            );
          } else {
            return this.refreshTokenSubject.pipe(
              filter(result => result !== null),
              take(1),
              switchMap(() => {
                request = this.addToken(request);
                return next.handle(request);
              })
            );
          }
        }
        return throwError(error);
      })
    );
  }

  private addToken(request: HttpRequest<any>): HttpRequest<any> {
    let user = this.authService.currentUserValue
    const token = this.authService.currentUserValue?.token;
    if (user && token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          "X-API-Key":`${this.authService.currentUserValue['x_api_token']}`
        }
      });
    }
    return request;
  }

  private handleError(error: any): Observable<never> {
    this.authService.logout();
    this.alert.error_alert("Session has expired! Please re-login!");
    return EMPTY;
  }
}