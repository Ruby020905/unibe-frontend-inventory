import { Routes } from '@angular/router';
import { Inventario } from './Inventario';
import { Login,  } from './Login';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'inventario', component: Inventario },
    
];
