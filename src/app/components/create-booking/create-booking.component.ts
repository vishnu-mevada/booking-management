import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from 'src/app/shared/services/booking.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
  providers: [DatePipe]
})
export class CreateBookingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  bookingForm!: FormGroup;

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private notify: NotificationService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      totalprice: [0, [Validators.required, Validators.min(1)]],
      depositpaid: [false],
      bookingdates: this.fb.group({
        checkin: ['', Validators.required],
        checkout: ['', Validators.required]
      }),
      additionalneeds: ['']
    });
  }

  submitBooking(): void {
    if (this.bookingForm.valid) {
      const formValue = this.bookingForm.value;

      const payload = {
        ...formValue,
        bookingdates: {
          checkin: this.datePipe.transform(formValue.bookingdates.checkin, 'yyyy-MM-dd'),
          checkout: this.datePipe.transform(formValue.bookingdates.checkout, 'yyyy-MM-dd')
        }
      };

      this.bookingService.addBooking(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.notify.success("Booking updated successfully.");
            this.router.navigate(['/']);
          },
          error: (error: any) => {
            this.notify.error(`Status: ${error.status}, Message: ${error.message}`);
          }
        });
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
