export class Miembro {

  id?: number;
  nombre: String;
  apellido: String;
  fechaNacimiento: number;
  sexo: String;
  estadoCivil: String;
  direccion: String;
  telefonoFijo: String;
  telefonoMovil: String;
  correo: String;
  fechaConversion: number;
  fechaBautismo: number;
  foto: String;
  estado: String;
  ultimoUsuario: String;
  iglesia_id: number;
  tipo_persona_id: number;

  constructor(nombre: string, apellido: string, fechaNacimiento: number,
              sexo: string, estadoCivil: string, direccion: string, telefonoFijo: string,
              telefonoMovil: string, correo: string, fechaConversion: number,
              fechaBautismo: number, foto: string, estado: string, ultimoUsuario: string,
              iglesia_id: number, tipo_persona_id: number) {
                this.nombre = nombre;
                this.apellido = apellido;
                this.fechaNacimiento = fechaNacimiento;
                this.sexo = sexo;
                this.estadoCivil = estadoCivil;
                this.direccion = direccion;
                this.telefonoFijo = telefonoFijo;
                this.telefonoMovil = telefonoMovil;
                this.correo = correo;
                this.fechaConversion = fechaConversion;
                this.fechaBautismo = fechaBautismo;
                this.foto = foto;
                this.estado = estado;
                this.ultimoUsuario = ultimoUsuario;
                this.iglesia_id = iglesia_id;
                this.tipo_persona_id = tipo_persona_id;
  }

}
