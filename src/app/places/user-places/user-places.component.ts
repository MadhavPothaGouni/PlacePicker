import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit{

  isfetching = signal(false);
  // places = signal<Place[] | undefined>(undefined);
  
  error = signal('');
  private destroyref = inject(DestroyRef);
  private PlacesService = inject(PlacesService)
  places = this.PlacesService.loadedUserPlaces;
  ngOnInit() {
    this.isfetching.set(true);
    const subscrition = 
    this.PlacesService.loadUserPlaces().subscribe({
        
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
  removeplace(place: Place){
   const subscrition =  this.PlacesService.removeUserPlace(place).subscribe()
   this.destroyref.onDestroy(() => {
    subscrition.unsubscribe();
  });
  }
  
}
