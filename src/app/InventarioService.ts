import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertaCaducidad } from './AlertaCaducidad';
import { Medicamento } from './Medicamento';

@Injectable({ providedIn: 'root' })
export class InventarioService {

  private api = 'http://localhost:8081/api/medicamentos';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  guardar(m: any): Observable<any> {
    return this.http.post(this.api, m);
  }

  exportar() {
  return this.http.get(
    'http://localhost:8081/api/medicamentos/excel',
    { responseType: 'blob' }
  );
}

  getAlertas(): Observable<AlertaCaducidad> {
    return this.http.get<AlertaCaducidad>(`${this.api}/alertas`);
  }

   eliminarMedicamento(id: any): Observable<any> {
      return this.http.delete(this.api, id);
    }
  
    editarMedicamento(m: any): Observable<any> {
      return this.http.put(this.api, m);
    }
      

}
