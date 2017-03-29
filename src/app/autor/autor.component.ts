import { Component, OnInit, ViewChild } from '@angular/core';
import { AutorService} from '../../shared/dataservices/autor.service'
import {IAutor} from '../../shared/settings/interfaces';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ModalDirective } from 'ng2-bootstrap/modal';
import {NgForm} from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap';
import * as _ from 'underscore';
import { PagerService } from '../../shared/dataservices/index'

@Component({
  moduleId: 'modulo.id',
  selector: 'autor',
  templateUrl: 'autor.component.html'
})
export class AutorComponent implements OnInit {
//propiedades del componente autor
nombre:string;
ape_pat:string;
ape_mat:string;
pais:string;

autor: IAutor; //Objecto enviado para la API
public alerts: any = []; //para los mensajes de alertas

// array of all items to be paged
private allItems: any[];

// pager object
pager: any = {};

// paged items
pagedItems: any[];

@ViewChild('autoShownModal') public autoShownModal: ModalDirective;
public isModalShown: boolean = false;

constructor(private autorService: AutorService, private pagerService: PagerService){}
  titulo1="LISTADO DE AUTORES"; 
  
  todoautores=[];
  titulo_modal="";
  idautor="";
  nombreautor="";
  btnguardar="";
  
   
    //para el modal Registro y Editar
    public showModal(t:string): void {
     
        if (t=="N"){
          this.titulo_modal="NUEVO/REGISTRAR";
          this.btnguardar="NEW";
        }
        if (t=="M"){
          this.btnguardar="EDIT"  
          this.titulo_modal="EDITAR/MODIFICAR";
        }
        console.log("btnguardar al inicio= "+this.btnguardar);
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
    @ViewChild('childModal') public childModal:ModalDirective;
 
    public showChildModal():void {
        this.childModal.show();
    }
    
    public hideChildModal():void {
        this.childModal.hide();
    }
   //Fin de modal Eliminar Registro
    ngOnInit() { 
         
        this.cargarAutores();
                
    }
  //cargar Autores
  cargarAutores(){
    this.autorService.getAutoresTodos().subscribe((todoautores:IAutor[])=>{
            this.todoautores= todoautores; 
            console.log('Listado de Autores cargado ');
            // set items to json response
            this.allItems = todoautores;
            // initialize to page 1
            this.setPage(1);
        },
         error=>{
            console.log('Fallo Conexion Autor '+error);
         });
  }

  //Nuevo Anexo Constructor
  guardar(aut:IAutor){
   this.autor = {
     "id": aut.id,
     "nombre": aut.nombre,
     "ape_pat": aut.ape_pat,
     "ape_mat": aut.ape_mat,
     "pais": aut.pais
    }
     console.log('Autor '+ aut.nombre);
     console.log("btnguardar al guardar= "+this.btnguardar);
    if (this.btnguardar=="NEW"){
        this.autorService.crearAutor(this.autor).subscribe(
          () => {
                  console.log('Autor created successfully. ');
                  this.cargarAutores();
                  this.addAlert('success','Autor Registrado.. Satisfactoriamente...');
                  this.hideModal();
                },
                  error => {
                  console.error('Error al Crear el Autor. '+error);
            });
    }

    if (this.btnguardar=="EDIT"){
        this.autorService.modificarAutor(this.autor).subscribe(
          () => {
                  console.log('Autor modificado successfully. ');
                  this.cargarAutores();
                  this.addAlert('success','Modificado Registrado...Satisfactoriamente...');
                  this.hideModal();
                },
                  error => {
                  console.error('Error al modificar el Autor. '+error);
                  this.addAlert('danger','..Error Problema al registrar...');
            });
    }

  }
  //Eliminar autor accion
  eliminar(id:number){
    this.autorService.eliminarAutor(id).subscribe(
          () => {
                  console.log('Autor Eliminado successfully. ');
                  this.cargarAutores();
                  this.addAlert('success','Registro Eliminado... Satisfactoriamente...');
                  this.hideChildModal();
                },
                  error => {
                  console.error('Error eliminar el Autor. '+error);
            });
  }

  //Setea datos Eliminar
  setAutorEliminar(au:IAutor){
      this.nombreautor=au.nombre+' '+au.ape_pat+' '+au.ape_pat;
      this.idautor=au.id.toString();
      this.showChildModal();
  }
  //boton Nuevo Modal
  nuevo(){
      this.showModal("N");
      this.limpiarInterface();
      
  }
  //Setea el objeto a editar
  editar(autoreditado){
      const esteditar = Object.assign({}, autoreditado) 
      this.showModal("M");
      this.autor = esteditar,
      this.autor = {
            "id": this.autor.id,
            "nombre": this.autor.nombre,
            "ape_pat": this.autor.ape_pat,
            "ape_mat": this.autor.ape_mat,
            "pais": this.autor.pais
       }
  }
 //Para la alerta personalizada
 public addAlert(tipo:string, mensaje:string): void {
    this.alerts.push({
      type: tipo,
      msg: mensaje,
      timeout: 3000
    });
  }

  limpiarInterface(){
      this.autor = {
            "nombre": "",
            "ape_pat": "",
            "ape_mat": "",
            "pais": ""
        }
  }

  setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            this.pagedItems=this.allItems;
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.allItems.length, page);

        // get current page of items
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    } 
  

}
