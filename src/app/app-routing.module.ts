//Angular Core
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Componentes de proyecto
import { EditarMiembroComponent } from './components/miembro/editar-miembro.component';
import { NuevoMiembroComponent } from './components/miembro/nuevo-miembro.component';
import { DetalleMiembroComponent } from './components/miembro/detalle-miembro.component';
import { ListaMiembroComponent } from './components/miembro/lista-miembro.component';
import { EditarTipoRegistroComponent } from './components/tipo-registro/editar-tipo-registro.component';
import { NuevoTipoRegistroComponent } from './components/tipo-registro/nuevo-tipo-registro.component';
import { DetalleTipoRegistroComponent } from './components/tipo-registro/detalle-tipo-registro.component';
import { ListaTipoRegistroComponent } from './components/tipo-registro/lista-tipo-registro.component';
import { EditarTipoPersonaComponent } from './components/tipo-persona/editar-tipo-persona.component';
import { NuevoTipoPersonaComponent } from './components/tipo-persona/nuevo-tipo-persona.component';
import { DetalleTipoPersonaComponent } from './components/tipo-persona/detalle-tipo-persona.component';
import { ListaTipoPersonaComponent } from './components/tipo-persona/lista-tipo-persona.component';
import { EditarTipoEventoComponent } from './components/tipo-evento/editar-tipo-evento.component';
import { NuevoTipoEventoComponent } from './components/tipo-evento/nuevo-tipo-evento.component';
import { DetalleTipoEventoComponent } from './components/tipo-evento/detalle-tipo-evento.component';
import { ListaTipoEventoComponent } from './components/tipo-evento/lista-tipo-evento.component';
import { EditarIglesiaComponent } from './components/iglesia/editar-iglesia.component';
import { NuevoIglesiaComponent } from './components/iglesia/nuevo-iglesia.component';
import { DetalleIglesiaComponent } from './components/iglesia/detalle-iglesia.component';
import { ListaIglesiaComponent } from './components/iglesia/lista-iglesia.component';
import { EditarEventoComponent } from './components/evento/editar-evento.component';
import { NuevoEventoComponent } from './components/evento/nuevo-evento.component';
import { DetalleEventoComponent } from './components/evento/detalle-evento.component';
import { ListaEventoComponent } from './components/evento/lista-evento.component';
import { EditarEventoDetalleComponent } from './components/evento-detalle/editar-evento-detalle.component';
import { NuevoEventoDetalleComponent } from './components/evento-detalle/nuevo-evento-detalle.component';
import { DetalleEventoDetalleComponent } from './components/evento-detalle/detalle-evento-detalle.component';
//import { ListaEventoDetalleComponent } from './components/evento-detalle/lista-evento-detalle.component';
//Login y Registro de usuarios
import { RegistroComponent } from './auth/registro.component';
import { LoginComponent } from './auth/login.component';
//Menu
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
//Guards
import { IglesiaGuardService as guard_iglesia} from './guards/iglesia-guard.service';
import { TipoEventoGuardService as guard_tipo_evento} from './guards/tipo-evento-guard.service';
import { TipoPersonaGuardService as guard_tipo_persona } from './guards/tipo-persona-guard.service';
import { TipoRegistroGuardService as guard_tipo_registro} from './guards/tipo-registro-guard.service';
import { MiembroGuardService as guard_miembro } from './guards/miembro-guard.service';
import { EventoGuardService as guard_evento } from './guards/evento-guard.service';
import { EventoDetalleGuardService as guard_evento_detalle } from './guards/evento-detalle-guard.service';


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
    {path:'tipo_evento/editar/:id', component:EditarTipoEventoComponent,  canActivate: [guard_tipo_evento], data: { expectedRol: ['admin'] }},
     //Tipo Persona
    {path:'tipo_persona/listar', component:ListaTipoPersonaComponent, canActivate: [guard_tipo_persona], data: { expectedRol: ['admin'] }},
    {path:'tipo_persona/detalle/:id', component:DetalleTipoPersonaComponent,  canActivate: [guard_tipo_persona], data: { expectedRol: ['admin'] }},
    {path:'tipo_persona/nuevo', component:NuevoTipoPersonaComponent,  canActivate: [guard_tipo_persona], data: { expectedRol: ['admin'] }},
    {path:'tipo_persona/editar/:id', component:EditarTipoPersonaComponent,  canActivate: [guard_tipo_persona], data: { expectedRol: ['admin'] }},
    //Tipo Registro Movimiento
    {path:'tipo_registro/listar', component:ListaTipoRegistroComponent, canActivate: [guard_tipo_registro], data: { expectedRol: ['admin'] }},
    {path:'tipo_registro/detalle/:id', component:DetalleTipoRegistroComponent,  canActivate: [guard_tipo_registro], data: { expectedRol: ['admin'] }},
    {path:'tipo_registro/nuevo', component:NuevoTipoRegistroComponent,  canActivate: [guard_tipo_registro], data: { expectedRol: ['admin'] }},
    {path:'tipo_registro/editar/:id', component:EditarTipoRegistroComponent,  canActivate: [guard_tipo_registro], data: { expectedRol: ['admin'] }},
    //Miembro
    {path:'miembro/listar', component:ListaMiembroComponent, canActivate: [guard_miembro], data: { expectedRol: ['admin', 'user'] }},
    {path:'miembro/detalle/:id', component:DetalleMiembroComponent,  canActivate: [guard_miembro], data: { expectedRol: ['admin', 'user'] }},
    {path:'miembro/nuevo', component:NuevoMiembroComponent,  canActivate: [guard_miembro], data: { expectedRol: ['admin', 'user' ]}},
    {path:'miembro/editar/:id', component:EditarMiembroComponent,  canActivate: [guard_miembro], data: { expectedRol: ['admin', 'user'] }},
    //Evento
    {path:'evento/listar', component:ListaEventoComponent, canActivate: [guard_evento], data: { expectedRol: ['admin', 'user'] }},
    {path:'evento/detalle/:id', component:DetalleEventoComponent,  canActivate: [guard_evento], data: { expectedRol: ['admin', 'user'] }},
    {path:'evento/nuevo', component:NuevoEventoComponent,  canActivate: [guard_evento], data: { expectedRol: ['admin', 'user' ]}},
    {path:'evento/editar/:id', component:EditarEventoComponent,  canActivate: [guard_evento], data: { expectedRol: ['admin', 'user'] }},
    //Evento Detalle
    //{path:'evento-detalle/listar', component:ListaEventoDetalleComponent, canActivate: [guard_evento_detalle], data: { expectedRol: ['admin', 'user'] }},
    {path:'evento-detalle/detalle/:id', component:DetalleEventoDetalleComponent,  canActivate: [guard_evento_detalle], data: { expectedRol: ['admin', 'user'] }},
    {path:'evento-detalle/nuevo', component:NuevoEventoDetalleComponent,  canActivate: [guard_evento_detalle], data: { expectedRol: ['admin', 'user' ]}},
    {path:'evento-detalle/editar/:id', component:EditarEventoDetalleComponent,  canActivate: [guard_evento_detalle], data: { expectedRol: ['admin', 'user'] }},
  ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
