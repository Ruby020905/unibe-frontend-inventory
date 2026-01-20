import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private apiUrl = 'http://localhost:8081/api/login';

  constructor(private http: HttpClient) {}

  // Este método envía la petición al backend
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, { username, password });
  }
}