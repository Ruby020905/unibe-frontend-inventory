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
getUsuarios(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:8081/api/login/usuarios');
}

eliminarUsuario(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
}
// En LoginService.ts
actualizarUsuario(id: number, datos: any): Observable<any> {
  // Asegúrate de que la URL coincida con tu Backend (usualmente /api/usuarios o /api/login/usuarios)
  return this.http.put(`http://localhost:8081/api/login/usuarios/${id}`, datos);
}
}