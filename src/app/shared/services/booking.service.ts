import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = 'api';
  private authToken$ = new BehaviorSubject<string | null | any>(null);

  constructor(private http: HttpClient) {}

  getAuthToken(): Observable<string | null> {
    return this.authToken$.value;
  }

  setAuthToken(token: string): void {
    this.authToken$.next(token);
  }

  getBookingToken(payload: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/auth`, payload, {
      headers: new HttpHeaders({ 'Skip-Auth': 'true' }),
    });
  }

  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/booking`, {
      headers: new HttpHeaders({ 'Skip-Auth': 'true' }),
    });
  }

  getBookingById(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/booking/${id}`, {
      headers: new HttpHeaders({ 'Skip-Auth': 'true' }),
    });
  }

  getBookingByName(firstname: string, lastname: string): Observable<any> {
    const params = { firstname, lastname };
    return this.http.get<any>(`${this.apiUrl}/booking`, {
      params,
      headers: new HttpHeaders({ 'Skip-Auth': 'true' }),
    });
  }

  getBookingByDate(checkin: string, checkout: string): Observable<any> {
    const params = { checkin, checkout };
    return this.http.get<any>(`${this.apiUrl}/booking`, {
      params,
      headers: new HttpHeaders({ 'Skip-Auth': 'true' }),
    });
  }

  addBooking(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/booking`, payload, {
      headers: new HttpHeaders({ 'Skip-Auth': 'true' }),
    });
  }

  updateBooking(payload: any, id: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/booking/${id}`, payload);
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/booking/${id}`);
  }
}
