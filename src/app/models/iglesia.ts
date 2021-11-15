export class Iglesia {
   id? :  number;
   nombre: String;
	 direccion: String;
	 pais: String;
	 correo: String;
	 telefono: String;
	 logo: String;
	 estado: String;
   fechaFundacion: number;

   constructor(nombre: string, direccion: string, pais: string, correo : string, telefono : string, estado : string, logo : string, fechaFundacion: number){
    this.nombre = nombre;
    this.direccion = direccion;
    this.pais = pais;
    this.correo = correo;
    this.estado = estado;
    this.telefono = telefono;
    this.logo = logo;
    this.fechaFundacion = fechaFundacion;
  }

}
