import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';      // Para redirigir al inventario
import { LoginService } from './LoginService';

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

  constructor(private loginService: LoginService, private router: Router) {}

 onLogin() {
  this.loginService.login(this.username, this.password).subscribe({
    next: (res) => {
      // Si el backend responde con un booleano true
      this.router.navigate(['/inventario']);
      if (res === true) {
    localStorage.setItem('usuarioLogueado', this.username); // Guardamos el nombre
    this.router.navigate(['/inventario']);
  }
    },
    error: (err) => {
      if (err.status === 401) {
        this.error = "Usuario o contraseña incorrectos.";
      } else {
        this.error = "El servidor no responde. Intente más tarde.";
      }
    }
    
  });
}
}