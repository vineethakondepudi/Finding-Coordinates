import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Map, MapStyle, Marker, config } from '@maptiler/sdk';
import { GeocodingService } from '../geocoding.service';
import * as maptilersdk from '@maptiler/sdk';





@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;
  clickedLatitude: number | undefined;
  clickedLongitude: number | undefined;
  clickedAddress: string | undefined;
  username:string | undefined;
  noUsersFoundMessage: string | undefined = '';
  displayedUsers: any[] = [];
  selectedUser: any | null = null;
  private userCardMap: Map | undefined;
  userLocationX: number | undefined;
 userLocationY: number | undefined;
 userCardOpen: boolean = false;
 userMarker: Marker | undefined;
 visible: boolean = false;


  constructor(private geocodingService: GeocodingService) {}

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
    config.apiKey = 'fjwYPVI1cIuGWwKVQo31';
  }

  ngAfterViewInit() {
    const initialState = { lng: 83.5385, lat: 17.9916, zoom: 10 };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    

    this.map.on('click', (event) => {
      const coordinates = event.lngLat;
      this.clickedLatitude = coordinates.lat;
      this.clickedLongitude = coordinates.lng;
      

      this.geocodingService.getNearestUsers(this.clickedLatitude, this.clickedLongitude, 10).subscribe(
        (results: any) => {
          if (results.length > 0) {
            this.displayNearestUsers(results);
          } else {
            this.noUsersFound();
          }
        },
        (error) => {
          console.error('Error finding nearest users:', error);
        }
      );
    });

    new Marker({ color: "#FF0000" })
      .setLngLat([83.5385, 17.9916])
      .addTo(this.map);
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  displayNearestUsers(users: any[]) {
    console.log('User Names:', users.map(user => user.username));
    console.log('Latitude:', users.map(user => user.latitude));
    console.log('Longitude:', users.map(user => user.longitude));
  
    this.displayedUsers = users; // Store the entire user objects
    this.noUsersFoundMessage = ''; // Reset the message

      // Close the user card if it is open
      if (this.userCardOpen) {
        this.closeUserCard();
    
      }
  }
  
  noUsersFound() {
    if (this.displayedUsers.length === 0) {
      // this.noUsersFoundMessage = 'No user found'; // Set the message
    }
    console.log('No user found');
    this.noUsersFoundMessage = 'No user found';
    this.displayedUsers = [];

      // Close the user card if it is open
      if (this.userCardOpen) {
        this.closeUserCard();
        this.visible = false;
      }
  }
  
  
  showUserCard(user: any) {
    this.selectedUser = user;
    this.userCardOpen = true; // Set the user card as open
    this.visible = true;
  }
  closeUserCard() {
    console.log("Close button clicked.");
    this.selectedUser = null; 
    
  }
  


  initializeUserCardMap(user: any) {
    if (this.userCardMap) {
        this.userCardMap.remove();
    }

    this.userCardMap = new Map({
        container: 'user-card-map',
        style: maptilersdk.MapStyle.STREETS,
        center: [user.longitude, user.latitude],
        zoom: 12,
        // dragPan: false,
        // scrollZoom: false
    });

    // Add a marker to highlight the user's location
    const marker = new Marker({ color: "blue" })
        .setLngLat([user.longitude, user.latitude])
        .addTo(this.userCardMap);
}
  
}  



// updateUserLocationOnMap(latitude: number, longitude: number) {
//   if (this.map) {
//     this.map.setCenter([longitude, latitude]);
//   }
// }

    // Add a marker to highlight the user's location
    // const marker = new Marker({ color: "#FF0000" }) // You can use any color of your choice
    //   .setLngLat([user.longitude, user.latitude]) // Set marker at user's coordinates
    //   .addTo(this.userCardMap);
  

        // Calculate the position of the user's location in pixels on the map
        // const userLocation = this.userCardMap.project([user.longitude, user.latitude]);
        // Set the position of the user highlight element
        // this.userLocationX = userLocation.x;
        // this.userLocationY = userLocation.y;