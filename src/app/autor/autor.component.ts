import { Component, OnInit, ViewChild } from '@angular/core';
import { AutorService} from '../../shared/dataservices/autor.service'
import {IAutor} from '../../shared/settings/interfaces';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ModalDirective } from 'ng2-bootstrap/modal';
import {NgForm} from '@angular/forms';

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

@ViewChild('autoShownModal') public autoShownModal: ModalDirective;
public isModalShown: boolean = false;

constructor(private autorService: AutorService){}
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
         },
         error=>{
            console.log('Fallo Conexion Autor '+error);
         });
  }

  //Nuevo Anexo Constructor
  guardar(aut:IAutor){
   this.autor = {
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
                  
                  this.hideModal();
                },
                  error => {
                  console.error('Error al modificar el Autor. '+error);
            });
    }

  }
  //Eliminar autor accion
  eliminar(id:number){
    this.autorService.eliminarAutor(id).subscribe(
          () => {
                  console.log('Autor Eliminado successfully. ');
                  this.cargarAutores();
                  //this.limpiarInterface();
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
  editar(autor){
      this.showModal("M");
      
      this.autor = {
            "id": autor.id,
            "nombre": autor.nombre,
            "ape_pat": autor.ape_pat,
            "ape_mat": autor.ape_mat,
            "pais": autor.pais
       }
  }

  limpiarInterface(){
      this.autor = {
            "nombre": "",
            "ape_pat": "",
            "ape_mat": "",
            "pais": ""
        }
  } 

}
