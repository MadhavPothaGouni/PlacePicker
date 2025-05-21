import { Component, DestroyRef, inject, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesService } from '../places.service';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent {
  isfetching = signal(false);
  private PlacesService = inject(PlacesService)
  places = signal<Place[] | undefined>(undefined);
  error = signal('');
  private httpclient = inject(HttpClient);
  private destroyref = inject(DestroyRef);

  ngOnInit() {
    this.isfetching.set(true);
    const subscrition = this.PlacesService.loadAvailablePlaces()
      .subscribe({
        next: (places) => {
          console.log(places);
          this.places.set(places);
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
        complete: () => {
          this.isfetching.set(false);
        },
      });
    this.destroyref.onDestroy(() => {
      subscrition.unsubscribe();
    });
  }
  onSelectPlace(selectedPlace: Place){
    const subscrition = this.PlacesService.addPlaceToUserPlaces(selectedPlace).subscribe({
      next: (resData) => console.log(resData),
    })
    this.destroyref.onDestroy(() => {
      subscrition.unsubscribe();
    });
  }
}
