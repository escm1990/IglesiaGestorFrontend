import { MovimientoDetalleService } from './../../service/movimiento-detalle.service';
import { MovimientoDetalleArray } from './../../models/movimiento-detalle-array';
import { MovimientoDetalle } from './../../models/movimiento-detalle';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from './../../service/token.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MovimientoService } from './../../service/movimiento.service';
import { Movimiento } from './../../models/movimiento';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';

export interface iDetalleInsertar{
  tipo: number;
  monto: number;
  comentario: string;
  miembro: number;
}

@Component({
  selector: 'app-detalle-movimiento',
  templateUrl: './detalle-movimiento.component.html',
  styleUrls: ['./detalle-movimiento.component.scss']
})
export class DetalleMovimientoComponent implements OnInit, OnDestroy {

  filas: iDetalleInsertar[] = [];

  movimiento: Movimiento;
  movimientoDetalleVar: MovimientoDetalle;
  movimientoDetalle: MovimientoDetalle[] = [];
  movimientoDetalleExcel: MovimientoDetalle[] = [];
  movimientoDetalleArray: MovimientoDetalleArray;

  id = this.activateRoute.snapshot.params.id;
  fechaMostrar = '';

  isAdmin =  false;
  roles: string[];

  index: number = 0;
  isExcelFile: boolean;
  spinnerEnabled = false;
  keys: string[];
  dataSheet: Subject<any> = new Subject<any>();
  @ViewChild('inputFile') inputFile: ElementRef;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private activateRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private tokenService: TokenService,
    private movimientoService: MovimientoService,
    private movimientoDetalleService: MovimientoDetalleService
  ) { }

  ngOnInit(): void {
    this.evaluarRoles();
    this.mostrarDetalle();
    this.movimientoService.setMovimientoId(this.id);
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
    this.movimientoService.detalle(this.id).subscribe(
      {
        next: (data) => {
          this.movimiento = data;
          this.fechaMostrar =  this.milisegundosFecha(this.movimiento.fecha);
          this.cargarDetalleMovimiento(this.id);
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
    this.movimientoService.eliminar(id).subscribe(
      {
        complete: () =>{
          this.toastr.success('Evento Detalle Eliminado', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.dtTrigger.unsubscribe();
          //this.cargarListaDetalleEvento();
          this.volverCargar();
        },
        error: (e) => {
          this.toastr.error(e, 'Error (borrar)', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      }
    );
  }

  onChange(evt: any) {
    let data: any, header;
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    if (this.isExcelFile) {
      this.spinnerEnabled = true;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json<iDetalleInsertar>(ws);

        //Construyendo el objeto para almacenar la información
        this.filas = XLSX.utils.sheet_to_json<iDetalleInsertar>(ws);
        console.log(this.filas);

      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.spinnerEnabled = false;
        this.keys = Object.keys(data[0]);
        this.dataSheet.next(data)
      }

    } else {
      this.inputFile.nativeElement.value = '';
    }
  }

  removeData(){
    this.inputFile.nativeElement.value = '';
    this.dataSheet.next(null);
    this.keys = [];
    this.isExcelFile = false;
  }

  guardarCargaExcel(){
    let indx: number = 0;

    this.filas.forEach(x => {
        var salCom: string = '';
        var salMie: number = 0;
        var ultUser: string = this.tokenService.getUsername();
        var salTip: number = 0;
        var salMon: number = 0;

        if(x.miembro === undefined || x.miembro.toString().length == 0){
          salMie = 0;
        }else{
          salMie = +x.miembro.toString();
        }
        console.log(salMie);

        if(x.comentario === undefined || x.comentario.length == 0){
          salCom = 'NA';
        }else{
          salCom = x.comentario.toString();
        }
        console.log(salCom)

        salTip = +x.tipo.toString();
        console.log(salTip)

        salMon = +x.monto.toString();
        console.log(salMon)

        this.movimientoDetalleVar = new MovimientoDetalle(this.id,salTip,salCom,salMon,salMie,'ACTIVO',ultUser);
        //console.log(this.ed);

        this.movimientoDetalleExcel.push(this.movimientoDetalleVar);
        //console.log('Objeto eventoDetalle arreglo');
        //console.log(this.eventoDetalleExcel[indx]);
        indx = indx + 1;

    });

    this.movimientoDetalleArray = new MovimientoDetalleArray(this.movimientoDetalleExcel);

      //  console.log('Objeto movimientoDetalleArray nuevo');
      //  console.log(this.movimientoDetalleArray);

    this.movimientoDetalleService.guardarCargaExcel(this.movimientoDetalleArray).subscribe(
      {
        complete: () => {
          console.log('Carga de Excel guardada exitosamente')
        },
        error: (e) => {
          this.toastr.error(e, 'Error al cargar Excel', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        }
      }
    );

    this.volverCargar();
  }

  cargarDetalleMovimiento(id: number){
     this.index = 0;
     this.movimientoDetalleService.listarMovimiento(id).subscribe(
      {
        next: (data) =>{
          this.movimientoDetalle = data;
          this.dtTrigger.next(data);
        },
        error: (e) => {
          this.toastr.error(e, 'Error (listarDetallePorMovimiento)', {
            timeOut: 3000, positionClass: 'toast-top-center',
          });
        },
        complete: () => console.info('Consulta de detalle de movimiento finalizada')

      }
     );
  }

  volver(): void {
    this.router.navigate(['/dashboard/movimiento/listar']);
  }

  milisegundosFecha(milisegundos: number) : string{
    var date = new Date(milisegundos);
    var result = date.toLocaleDateString(); // 10/29/2013
    return result;
  }

  volverCargar(): void {
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

}

