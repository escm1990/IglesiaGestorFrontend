import { EditarTipoEventoComponent } from './tipo-evento/editar-tipo-evento.component';
import { NuevoTipoEventoComponent } from './tipo-evento/nuevo-tipo-evento.component';
import { DetalleTipoEventoComponent } from './tipo-evento/detalle-tipo-evento.component';
import { ListaTipoEventoComponent } from './tipo-evento/lista-tipo-evento.component';
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
import { IglesiaGuardService as guard_iglesia} from './guards/iglesia-guard.service';
import { TipoEventoGuardService as guard_tipo_evento} from './guards/tipo-evento-guard.service';

const routes: Routes = [

  {path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //Login
  {path:'login', component:LoginComponent},
  {path:'registro', component:RegistroComponent},
  //Dashborad
  { path: 'dashboard', component: DashboardComponent, children: [
    {path: '', redirectTo: 'home', pathMatch: 'full' },
    {path:'home', component:HomeComponent},
    //Iglesia
    {path:'iglesia/listar', component:ListaIglesiaComponent, canActivate: [guard_iglesia], data: { expectedRol: ['admin'] }},
    {path:'iglesia/detalle/:id', component:DetalleIglesiaComponent,  canActivate: [guard_iglesia], data: { expectedRol: ['admin'] }},
    {path:'iglesia/nuevo', component:NuevoIglesiaComponent,  canActivate: [guard_iglesia], data: { expectedRol: ['admin'] }},
    {path:'iglesia/editar/:id', component:EditarIglesiaComponent,  canActivate: [guard_iglesia], data: { expectedRol: ['admin'] }},
    //Tipo Evento
    {path:'tipo_evento/listar', component:ListaTipoEventoComponent, canActivate: [guard_tipo_evento], data: { expectedRol: ['admin'] }},
    {path:'tipo_evento/detalle/:id', component:DetalleTipoEventoComponent,  canActivate: [guard_tipo_evento], data: { expectedRol: ['admin'] }},
    {path:'tipo_evento/nuevo', component:NuevoTipoEventoComponent,  canActivate: [guard_tipo_evento], data: { expectedRol: ['admin'] }},
    {path:'tipo_evento/editar/:id', component:EditarTipoEventoComponent,  canActivate: [guard_tipo_evento], data: { expectedRol: ['admin'] }}
  ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
