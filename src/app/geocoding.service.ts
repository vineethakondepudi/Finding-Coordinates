import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  private baseUrl = 'http://172.17.15.127:3000'; // Update with your backend server URL

  constructor(private http: HttpClient) {}

  

  getNearestUsers(latitude: number, longitude: number, maxDistance: number): Observable<any> {
    const url = `${this.baseUrl}/api/nearest-users`;
    const params = { latitude, longitude, maxDistance };

    return this.http.get(url, { params });
  }
  

  
}
