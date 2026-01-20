import { HttpClient } from "@angular/common/http";
import { Medicamento } from "./Medicamento";
import { Injectable } from "@angular/core";
import { AlertaCaducidad } from "./AlertaCaducidad";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class MedicamentoService {

  private httpOptions = {
    withCredentials: true
  };
  private api = 'http://localhost:8081/api/medicamentos';

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Medicamento[]>(this.api, this.httpOptions);
  }

  guardar(m: Medicamento) {
    return this.http.post(this.api, m, this.httpOptions);
  }

 
 exportar() {
  window.open(`${this.api}/exportar`);
}

 // Elimina alertas() y usa solo este:
getAlertas(): Observable<AlertaCaducidad> {
  return this.http.get<AlertaCaducidad>(`${this.api}/alertas`, this.httpOptions);
}

eliminar(id: number) {
  // Asegúrate de que NO haya un ":" después de la barra "/"
  return this.http.delete(`${this.api}/${id}`, this.httpOptions);
}
editar(m: Medicamento) {
  return this.http.put(`${this.api}/${m.id}`, m); 
}
    
  
}
