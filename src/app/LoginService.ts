import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, take, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class LoginService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  // MÉTODO ÚNICO DE LOGIN
 login(username: string, password: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
    take(1),            // <--- IMPORTANTE: Solo toma la primera respuesta y cancela el resto
    timeout(2000),      // <--- IMPORTANTE: Si tarda más de 2 segundos, aborta inmediatamente
    catchError(err => {
      return throwError(() => err); // Propaga el error para que lo maneje el componente
    })
  );
}

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, usuario);
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/login/usuarios`);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
  }

  actualizarUsuario(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/login/usuarios/${id}`, datos);
  }
}