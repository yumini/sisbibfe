import { Component, OnInit, ViewChild } from '@angular/core';
import { MateriaService } from '../../shared/dataservices/materia.service';
import { IMateria } from '../../shared/settings/interfaces';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { NgForm } from '@angular/forms';
import * as _ from 'underscore';
import { PagerService } from '../../shared/dataservices/index'

@Component({
  moduleId: 'modulo.id',
  selector: 'materia',
  templateUrl: 'materia.component.html'
})
export class MateriaComponent implements OnInit {
  //propiedades del componente materia
  nombre: string;  

  materia: IMateria; //Objecto enviado para la API

  @ViewChild('autoShownModal') public autoShownModal: ModalDirective;
  public isModalShown: boolean = false;

  constructor(private materiaService: MateriaService, private pagerService: PagerService) { }
  titulo1 = "LISTADO DE MATERIAS";

  public todomaterias = [];
  public titulo_modal = "";
  public idmateria = "";
  public nombremateria = "";
  public btnguardar = "";

  // array of all items to be paged
  private allItems: any[];
  // pager object
  public pager: any = {};
  // paged items
  public pagedItems: any[];

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

    this.cargarMaterias();

  }
  //cargar Materias
  cargarMaterias() {
    this.materiaService.getMateriasTodos().subscribe((todomaterias: IMateria[]) => {
      this.todomaterias = todomaterias;
      console.log('Listado de Materias cargado ');
      // set items to json response
      this.allItems = todomaterias;
      console.log(this.allItems);
      // initialize to page 1
      this.setPage(1);
    },
      error => {
        console.log('Falló Conexión materias ' + error);
      });
  }

  //Nuevo Anexo Constructor
  guardar(ma: IMateria) {
    this.materia = {
      "idmateria": ma.idmateria,
      "nombre": ma.nombre
    }
    console.log('Pais ' + ma.nombre);
    console.log("btnguardar al guardar= " + this.btnguardar);
    if (this.btnguardar == "NEW") {
      this.materiaService.crearPais(this.materia).subscribe(
        () => {
          console.log('materia created successfully. ');
          this.cargarMaterias();

          this.hideModal();
        },
        error => {
          console.error('Error al Crear la Materia. ' + error);
        });
    }

    if (this.btnguardar == "EDIT") {
      this.materiaService.modificarMateria(this.materia).subscribe(
        () => {
          console.log('Pais modificado successfully. ');
          this.cargarMaterias();

          this.hideModal();
        },
        error => {
          console.error('Error al modificar el Pais. ' + error);
        });
    }

  }
  //Eliminar materia accion
  eliminar(idmateria: number) {
    this.materiaService.eliminarMateria(idmateria).subscribe(
      () => {
        console.log('Materia Eliminado successfully. ');
        this.cargarMaterias();
        this.hideChildModal();
      },
      error => {
        console.error('Error eliminar la materia. ' + error);
      });
  }

  //Setea datos Eliminar
  setMateriaEliminar(ma: IMateria) {
    this.nombremateria = ma.nombre;
    this.idmateria = ma.idmateria.toString();
    this.showChildModal();
  }
  //boton Nuevo Modal
  nuevo() {
    this.showModal("N");
    this.limpiarInterface();

  }
  //Setea el objeto a editar
  editar(materiaeditado) {
    const materiaeditar = Object.assign({}, materiaeditado)
    this.showModal("M");
    this.materia = materiaeditar,
      this.materia = {
        "idmateria": this.materia.idmateria,
        "nombre": this.materia.nombre        
      }
  }

  limpiarInterface() {
    this.materia = {
      "nombre": ""      
    }
  }

  public setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            this.pagedItems = this.allItems;
            this.pager = this.pagerService.getPager(this.allItems.length, page);
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.allItems.length, page);

        // get current page of items
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

}