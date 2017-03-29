import { Component, OnInit, ViewChild } from '@angular/core';
import { PaisService } from '../../shared/dataservices/pais.service';
import { IPais } from '../../shared/settings/interfaces';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { NgForm } from '@angular/forms';

@Component({
  moduleId: 'modulo.id',
  selector: 'pais',
  templateUrl: 'pais.component.html'
})
export class PaisComponent implements OnInit {
  //propiedades del componente pais
  nombre: string;  

  pais: IPais; //Objecto enviado para la API

  @ViewChild('autoShownModal') public autoShownModal: ModalDirective;
  public isModalShown: boolean = false;

  constructor(private paisService: PaisService) { }
  titulo1 = "LISTADO DE PAISES";

  public todopaises = [];
  public titulo_modal = "";
  public idpais = "";
  public nombrepais = "";
  public btnguardar = "";

  //para el modal Registro y Editar
  public showModal(t: string): void {

    if (t == "N") {
      this.titulo_modal = "NUEVO/REGISTRAR";
      this.btnguardar = "NEW";
    }
    if (t == "M") {
      this.btnguardar = "EDIT"
      this.titulo_modal = "EDITAR/MODIFICAR";
    }
    console.log("btnguardar al inicio= " + this.btnguardar);
    this.isModalShown = true;
  }
  public hideModal(): void {
    this.autoShownModal.hide();
    //this.est={};
  }
  public onHidden(): void {
    this.isModalShown = false;
  }
  //fin de metodos modal registro y Editar

  //Modal Eliminar Registro
  @ViewChild('childModal') public childModal: ModalDirective;

  public showChildModal(): void {
    this.childModal.show();
  }

  public hideChildModal(): void {
    this.childModal.hide();
  }
  //Fin de modal Eliminar Registro
  ngOnInit() {

    this.cargarPaises();

  }
  //cargar Paises
  cargarPaises() {
    this.paisService.getPaisesTodos().subscribe((todopaises: IPais[]) => {
      this.todopaises = todopaises;
      console.log('Listado de Paises cargado ');
    },
      error => {
        console.log('Falló Conexión Pais ' + error);
      });
  }

  //Nuevo Anexo Constructor
  guardar(pa: IPais) {
    this.pais = {
      "idpais": pa.idpais,
      "nombre": pa.nombre
    }
    console.log('Pais ' + pa.nombre);
    console.log("btnguardar al guardar= " + this.btnguardar);
    if (this.btnguardar == "NEW") {
      this.paisService.crearPais(this.pais).subscribe(
        () => {
          console.log('Pais created successfully. ');
          this.cargarPaises();

          this.hideModal();
        },
        error => {
          console.error('Error al Crear el País. ' + error);
        });
    }

    if (this.btnguardar == "EDIT") {
      this.paisService.modificarPais(this.pais).subscribe(
        () => {
          console.log('Pais modificado successfully. ');
          this.cargarPaises();

          this.hideModal();
        },
        error => {
          console.error('Error al modificar el Pais. ' + error);
        });
    }

  }
  //Eliminar pais accion
  eliminar(idpais: number) {
    this.paisService.eliminarPais(idpais).subscribe(
      () => {
        console.log('Pais Eliminado successfully. ');
        this.cargarPaises();
        //this.limpiarInterface();
        this.hideChildModal();
      },
      error => {
        console.error('Error eliminar el Pais. ' + error);
      });
  }

  //Setea datos Eliminar
  setPaisEliminar(pa: IPais) {
    this.nombrepais = pa.nombre;
    this.idpais = pa.idpais.toString();
    this.showChildModal();
  }
  //boton Nuevo Modal
  nuevo() {
    this.showModal("N");
    this.limpiarInterface();

  }
  //Setea el objeto a editar
  editar(paiseditado) {
    const paiseditar = Object.assign({}, paiseditado)
    this.showModal("M");
    this.pais = paiseditar,
      this.pais = {
        "idpais": this.pais.idpais,
        "nombre": this.pais.nombre        
      }
  }

  limpiarInterface() {
    this.pais = {
      "nombre": ""      
    }
  }

}