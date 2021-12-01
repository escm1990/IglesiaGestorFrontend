import { Iglesia } from './../models/iglesia';
import { IglesiaService } from './../service/iglesia.service';
import { ToastrService } from 'ngx-toastr';
import { NuevoUsuario } from './../models/nuevo-usuario';
import { AuthService } from './../service/auth.service';
import { TokenService } from './../service/token.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  nuevoUsuario: NuevoUsuario;
  usuario: string;
  password: string;
  correo: string;
  estado: string = 'ACTIVO';
  errMsj: String;
  isLogged: boolean = false;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {

    if(this.tokenService.getToken()){
      this.isLogged = true;
    }
  }

  onRegister(): void{
    this.nuevoUsuario = new NuevoUsuario(this.usuario, this.password, this.correo, this.estado);
    this.authService.nuevo(this.nuevoUsuario).subscribe(
      data => {
        this.toastr.success('Usuario Creado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/login']);
      },
      err =>{
        this.errMsj = err.error.mensaje;
        this.toastr.success('Error al crear cuenta: '+this.errMsj, 'Fail', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        //console.log(this.errMsj);
      }
    );
  }

}
