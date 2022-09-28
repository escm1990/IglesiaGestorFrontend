import { TokenService } from './../../service/token.service';
import { ToastrService } from 'ngx-toastr';
import { MovimientoService } from './../../service/movimiento.service';
import { Subject } from 'rxjs';
import { Movimiento } from './../../models/movimiento';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-lista-movimiento',
  templateUrl: './lista-movimiento.component.html',
  styleUrls: ['./lista-movimiento.component.scss']
})
export class ListaMovimientoComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  movimientos: Movimiento[] = [];
  roles: string[];
  isAdmin =  false;
  iglesiaTemp: string;
  iglesia_id: number;

  constructor(
    private movimientoService: MovimientoService,
    private toastr: ToastrService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol =>{
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
    this.cargarMovimientos();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  cargarMovimientos(){
    if(this.isAdmin){
      this.movimientoService.listar().subscribe(
        {
          next: (data) => {
            this.movimientos = data;
            this.dtTrigger.next(data);
          },
          error: (e) => {
            this.toastr.error(e, 'Error (listar)', {
              timeOut: 3000, positionClass: 'toast-top-center',
            });
          },
          complete: () => console.info('Consulta de movimientos finalizada')
        }
      )
    } else {
      this.iglesiaTemp = this.tokenService.getUserIglesiaId();
      this.iglesia_id = +this.iglesiaTemp;
      this.movimientoService.listarIglesia(this.iglesia_id).subscribe(
        {
          next: (data) => {
            this.movimientos = data;
            this.dtTrigger.next(data);
          },
          error: (e) => {
            this.toastr.error(e, 'Error (listarPorIglesia)', {
              timeOut: 3000, positionClass: 'toast-top-center',
            });
          },
          complete: () => console.info('Consulta de eventos finalizada')
        }
      )
    }
  }

  borrar(id: number | any){
    this.movimientoService.eliminar(id).subscribe({
      error: (e) => {
        this.toastr.error(e, 'Error (borrar)', {
          timeOut: 3000, positionClass: 'toast-top-center',
        });
      },
      complete: () => {
        this.toastr.success('Movimiento Eliminado', 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.dtTrigger.unsubscribe();
        this.cargarMovimientos();
      }
    });
  }

}
