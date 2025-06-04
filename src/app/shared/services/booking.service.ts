import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = "api";
  private authToken$ = new BehaviorSubject<string | null | any>(null);

  constructor(private http: HttpClient) { }

  getAuthToken(): Observable<string | null> {
    return this.authToken$.value;
  }

  setAuthToken(token: string): void {
    this.authToken$.next(token);
  }

  getBookingToken(payload: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/auth`, payload, {
      headers: {
        'Skip-Auth': 'true'
      }
    });
  }

  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/booking`);
  }

  getBookingById(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/booking/${id}`);
  }

  getBookingByName(firstname: string, lastname: string): Observable<any> {
    const params = { firstname, lastname };
    return this.http.get<any>(`${this.apiUrl}/booking`, { params });
  }

  getBookingByDate(checkin: string, checkout: string): Observable<any> {
    const params = { checkin, checkout };
    return this.http.get<any>(`${this.apiUrl}/booking`, { params });
  }

  addBooking(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/booking`, payload);
  }

  updateBooking(payload: any, id: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/booking/${id}`, payload);
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/booking/${id}`);
  }
}
