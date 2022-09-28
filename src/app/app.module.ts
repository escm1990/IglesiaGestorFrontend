import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';


import { LoginComponent } from './auth/login.component';
import { RegistroComponent } from './auth/registro.component';
import { NuevoIglesiaComponent } from './components/iglesia/nuevo-iglesia.component';
import { DetalleIglesiaComponent } from './components/iglesia/detalle-iglesia.component';
import { ListaIglesiaComponent } from './components/iglesia/lista-iglesia.component';
import { EditarIglesiaComponent } from './components/iglesia/editar-iglesia.component';
import { interceptorProvider } from './interceptors/auth-interceptor.service';
import { ToastrModule } from 'ngx-toastr';
import { UploadFilesComponent } from './upload-files/upload-files.component';
import { ListaTipoEventoComponent } from './components/tipo-evento/lista-tipo-evento.component';
import { NuevoTipoEventoComponent } from './components/tipo-evento/nuevo-tipo-evento.component';
import { EditarTipoEventoComponent } from './components/tipo-evento/editar-tipo-evento.component';
import { DetalleTipoEventoComponent } from './components/tipo-evento/detalle-tipo-evento.component';
import { ListaTipoPersonaComponent } from './components/tipo-persona/lista-tipo-persona.component';
import { DetalleTipoPersonaComponent } from './components/tipo-persona/detalle-tipo-persona.component';
import { EditarTipoPersonaComponent } from './components/tipo-persona/editar-tipo-persona.component';
import { NuevoTipoPersonaComponent } from './components/tipo-persona/nuevo-tipo-persona.component';
import { NuevoTipoRegistroComponent } from './components/tipo-registro/nuevo-tipo-registro.component';
import { EditarTipoRegistroComponent } from './components/tipo-registro/editar-tipo-registro.component';
import { ListaTipoRegistroComponent } from './components/tipo-registro/lista-tipo-registro.component';
import { DetalleTipoRegistroComponent } from './components/tipo-registro/detalle-tipo-registro.component';
import { DetalleMiembroComponent } from './components/miembro/detalle-miembro.component';
import { EditarMiembroComponent } from './components/miembro/editar-miembro.component';
import { ListaMiembroComponent } from './components/miembro/lista-miembro.component';
import { NuevoMiembroComponent } from './components/miembro/nuevo-miembro.component';

import {DataTablesModule} from 'angular-datatables';
import { DetalleEventoComponent } from './components/evento/detalle-evento.component';
import { EditarEventoComponent } from './components/evento/editar-evento.component';
import { ListaEventoComponent } from './components/evento/lista-evento.component';
import { NuevoEventoComponent } from './components/evento/nuevo-evento.component';
import { DetalleEventoDetalleComponent } from './components/evento-detalle/detalle-evento-detalle.component';
import { EditarEventoDetalleComponent } from './components/evento-detalle/editar-evento-detalle.component';
//import { ListaEventoDetalleComponent } from './components/evento-detalle/lista-evento-detalle.component';
import { NuevoEventoDetalleComponent } from './components/evento-detalle/nuevo-evento-detalle.component';
import { DetalleMovimientoComponent } from './components/movimiento/detalle-movimiento.component';
import { EditarMovimientoComponent } from './components/movimiento/editar-movimiento.component';
import { ListaMovimientoComponent } from './components/movimiento/lista-movimiento.component';
import { NuevoMovimientoComponent } from './components/movimiento/nuevo-movimiento.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavComponent,
    HomeComponent,
    DashboardComponent,
    LoginComponent,
    RegistroComponent,
    NuevoIglesiaComponent,
    DetalleIglesiaComponent,
    ListaIglesiaComponent,
    EditarIglesiaComponent,
    UploadFilesComponent,
    ListaTipoEventoComponent,
    NuevoTipoEventoComponent,
    EditarTipoEventoComponent,
    DetalleTipoEventoComponent,
    ListaTipoPersonaComponent,
    DetalleTipoPersonaComponent,
    EditarTipoPersonaComponent,
    NuevoTipoPersonaComponent,
    NuevoTipoRegistroComponent,
    EditarTipoRegistroComponent,
    ListaTipoRegistroComponent,
    DetalleTipoRegistroComponent,
    DetalleMiembroComponent,
    EditarMiembroComponent,
    ListaMiembroComponent,
    NuevoMiembroComponent,
    DetalleEventoComponent,
    EditarEventoComponent,
    ListaEventoComponent,
    NuevoEventoComponent,
    DetalleEventoDetalleComponent,
    EditarEventoDetalleComponent,
    //ListaEventoDetalleComponent,
    NuevoEventoDetalleComponent,
    DetalleMovimientoComponent,
    EditarMovimientoComponent,
    ListaMovimientoComponent,
    NuevoMovimientoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    // * MATERIAL IMPORTS
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatCardModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    //Toasts
    ToastrModule.forRoot(),
    //Datatables
    DataTablesModule
  ],
  providers: [interceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
