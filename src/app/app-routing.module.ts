import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingListComponent } from './components/booking-list/booking-list.component';
import { CreateBookingComponent } from './components/create-booking/create-booking.component';
import { UpdateBookingComponent } from './components/update-booking/update-booking.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '', component: BookingListComponent },
  { path: 'create', component: CreateBookingComponent },
  { path: 'update/:id', component: UpdateBookingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
