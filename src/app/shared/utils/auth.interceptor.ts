import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingService } from '../services/booking.service';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private bookingService: BookingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.headers.has('Skip-Auth')) {
      const cleanedReq = req.clone({
        headers: req.headers.delete('Skip-Auth')
      });
      return next.handle(cleanedReq);
    }

    const token = this.bookingService.getAuthToken();

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `token=${token}`
        }
      });
      return next.handle(authReq);
    }

    const payload = {
      username: 'admin',
      password: 'password123'
    };

    return this.bookingService.getBookingToken(payload).pipe(
      switchMap((res: any) => {
        const newToken = res?.token;
        if (newToken) {
          this.bookingService.setAuthToken(newToken);
          const authReq = req.clone({
            setHeaders: {
              Authorization: `token=${newToken}`
            }
          });
          return next.handle(authReq);
        } else {
          return next.handle(req);
        }
      }),
      catchError((error) => {
        console.error('Token fetch error:', error);
        return next.handle(req);
      })
    );
  }
}
