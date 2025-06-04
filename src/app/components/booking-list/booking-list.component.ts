import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookingService } from 'src/app/shared/services/booking.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
  providers: [DatePipe],
})
export class BookingListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  booking: any = null;
  bookingId: number | null = null;
  firstname: string = '';
  lastname: string = '';
  checkin: Date | null = null;
  checkout: Date | null = null;

  // Display dummy data if not found any result;
  bookingDummyData = {
    bookingid: 1,
    firstname: 'Test',
    lastname: 'User',
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: '2018-01-01',
      checkout: '2019-01-01',
    },
    additionalneeds: 'Breakfast',
  };

  constructor(
    private bookingService: BookingService,
    private notify: NotificationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.booking = this.bookingDummyData;
  }

  getBookingDetails(id: number | null) {
    if (!id) {
      this.notify.warning('Invalid booking ID.');
      return;
    }

    this.bookingService
      .getBookingById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.booking =
            res && typeof res === 'object' && !Array.isArray(res) ? {...res, bookingid: id} : null;
          this.bookingId = null;
        },
        error: (error: any) => {
          this.notify.error(
            `Status: ${error.status}, Message: ${error.message}`
          );
        },
      });
  }

  searchByName(): void {
    if (!this.firstname || !this.lastname) {
      this.notify.warning('Both first and last name are required.');
      return;
    }

    this.bookingService
      .getBookingByName(this.firstname, this.lastname)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.length && res[0].bookingid) {
            this.getBookingDetails(res[0].bookingid);
          } else {
            this.notify.info("Not found any data!")
          }
          this.firstname = '';
          this.lastname = '';
        },
        error: (error: any) => {
          this.notify.error(
            `Status: ${error.status}, Message: ${error.message}`
          );
        },
      });
  }

  searchByDate(): void {
    if (!this.checkin || !this.checkout) {
      this.notify.warning('Both check-in and check-out dates are required.');
      return;
    }

    const checkinStr: any = this.datePipe.transform(this.checkin, 'yyyy-MM-dd');
    const checkoutStr: any = this.datePipe.transform(this.checkout, 'yyyy-MM-dd');

    this.bookingService
      .getBookingByDate(checkinStr, checkoutStr)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.length && res[0].bookingid) {
            this.getBookingDetails(res[0].bookingid);
          } else {
            this.notify.info('Not found any data!');
          }
          this.checkin = null;
          this.checkout = null;
        },
        error: (error: any) => {
          this.notify.error(
            `Status: ${error.status}, Message: ${error.message}`
          );
        },
      });
  }

  onDelete(event: Event, id: number) {
    event.preventDefault();

    this.bookingService
      .deleteBooking(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.booking = {};
        },
        error: (error: any) => {
          this.notify.error(
            `Status: ${error.status}, Message: ${error.message}`
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
