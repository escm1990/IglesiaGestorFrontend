import { ToastrService } from 'ngx-toastr';
import { TokenService } from './../../service/token.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MovimientoService } from './../../service/movimiento.service';
import { Movimiento } from './../../models/movimiento';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-movimiento',
  templateUrl: './detalle-movimiento.component.html',
  styleUrls: ['./detalle-movimiento.component.scss']
})
export class DetalleMovimientoComponent implements OnInit {

  movimiento: Movimiento;
  id = this.activateRoute.snapshot.params.id;
  fechaMostrar = '';

  isAdmin =  false;
  roles: string[];

  isExcelFile: boolean;


  constructor(
    private activateRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private tokenService: TokenService,
    private movivimientoService: MovimientoService
  ) { }

  ngOnInit(): void {
    this.evaluarRoles();
    this.mostrarDetalle();
  }

  evaluarRoles(){
    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol =>{
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
  }

  mostrarDetalle(){
    this.movivimientoService.detalle(this.id).subscribe(
      {
        next: (data) => {
          this.movimiento = data;
          this.fechaMostrar =  this.milisegundosFecha(this.movimiento.fecha);
        },
        error: (err) => {
          this.toastr.error(err.error.mensaje, 'Error (Detalle1)', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
          this.volver();
        }
      }
    );
  }

  borrar(id: number | any){

  }

  onChange(evt: any) {

  }

  removeData(){

  }

  guardarCargaExcel(){

  }

  volver(): void {
    this.router.navigate(['/dashboard/movimiento/listar']);
  }

  milisegundosFecha(milisegundos: number) : string{
    var date = new Date(milisegundos);
    var result = date.toLocaleDateString(); // 10/29/2013
    return result;
  }

}

