import { Component, OnInit } from '@angular/core';
import { BookingService } from './shared/services/booking.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
  }

}
