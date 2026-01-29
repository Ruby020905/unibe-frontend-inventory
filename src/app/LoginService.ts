import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  // Este método envía la petición al backend
  login(username: string, password: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
}
  registrarUsuario(usuario: any) {
  // Asegúrate de que la URL sea exactamente esta:
  return this.http.post('http://localhost:8081/api/usuarios', usuario);
}
}