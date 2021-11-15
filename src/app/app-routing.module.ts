import { EditarIglesiaComponent } from './iglesia/editar-iglesia.component';
import { NuevoIglesiaComponent } from './iglesia/nuevo-iglesia.component';
import { DetalleIglesiaComponent } from './iglesia/detalle-iglesia.component';
import { ListaIglesiaComponent } from './iglesia/lista-iglesia.component';
import { RegistroComponent } from './auth/registro.component';
import { LoginComponent } from './auth/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //Login
  {path:'login', component:LoginComponent},
  {path:'registro', component:RegistroComponent},
  //Iglesia
  { path: 'dashboard', component: DashboardComponent, children: [
    {path: '', redirectTo: 'home', pathMatch: 'full' },
    {path:'home', component:HomeComponent},
    {path:'iglesia/listar', component:ListaIglesiaComponent},
    {path:'iglesia/detalle/:id', component:DetalleIglesiaComponent},
    {path:'iglesia/nuevo', component:NuevoIglesiaComponent},
    {path:'iglesia/editar/:id', component:EditarIglesiaComponent}
  ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
