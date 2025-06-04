import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BookingService } from '../services/booking.service';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private bookingService: BookingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check and remove 'Skip-Auth' if present
    const skipAuth = req.headers.has('Skip-Auth');
    let modifiedReq = req;

    if (skipAuth) {
      modifiedReq = req.clone({
        headers: req.headers.delete('Skip-Auth')
      });
    }

    // Always add 'Accept: application/json'
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        Accept: 'application/json'
      }
    });

    // Check for existing auth token
    const token = this.bookingService.getAuthToken() || 'YWRtaW46cGFzc3dvcmQxMjM';

    if (token) {
      const authReq = modifiedReq.clone({
        setHeaders: {
          Authorization: `Basic ${token}=`
        }
      });
      return next.handle(authReq);
    }

    // Fallback: Get token from API if not available
    const credentials = {
      username: 'admin',
      password: 'password123'
    };

    return this.bookingService.getBookingToken(credentials).pipe(
      switchMap((res: any) => {
        const newToken = res?.token;
        if (newToken) {
          this.bookingService.setAuthToken(newToken);
          const authReq = modifiedReq.clone({
            setHeaders: {
              Authorization: `Basic ${newToken}=`
            }
          });
          return next.handle(authReq);
        }
        return next.handle(modifiedReq);
      }),
      catchError(error => {
        console.error('Token fetch error:', error);
        return next.handle(modifiedReq);
      })
    );
  }
}
