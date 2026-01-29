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
 // En tu componente de Login
this.loginService.login(this.username, this.password).subscribe({
  next: (user) => {
    if (user) {
      // 'user' ahora es el objeto {username: 'ruby', rol: 'LECTOR'}
      localStorage.setItem('usuario_actual', JSON.stringify(user));
      this.router.navigate(['/inventario']);
    }
  }
});
}
}