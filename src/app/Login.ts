import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';      // Para redirigir al inventario
import { LoginService } from './LoginService';
import { ChangeDetectorRef } from '@angular/core'; // 1. Importa esto
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class Login{
  username = '';
  password = '';
  error = '';
isLoading = false;
  constructor(private loginService: LoginService, private router: Router,private cdr: ChangeDetectorRef) {}


// En tu archivo login.ts
onLogin() {
  this.error = ''; // Limpiamos mensajes anteriores
  
  this.loginService.login(this.username, this.password).subscribe({
    next: (user) => {
      if (user) {
        localStorage.setItem('usuario_actual', JSON.stringify(user));
        this.router.navigate(['/inventario']);
      } else {
        this.error = 'Usuario o contraseña incorrectos.';
      }
    },
   error: (err) => {
        this.error = 'Usuario o contraseña incorrectos.';
        this.cdr.detectChanges(); // 3. ¡FUERZA EL REFRESCO AQUÍ!
      }
  });
}
}