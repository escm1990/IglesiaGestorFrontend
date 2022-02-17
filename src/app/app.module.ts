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
    NuevoTipoPersonaComponent
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
    MatButtonModule,
    MatCardModule,
    MatAutocompleteModule,
    MatInputModule,
    //Toasts
    ToastrModule.forRoot()
  ],
  providers: [interceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
