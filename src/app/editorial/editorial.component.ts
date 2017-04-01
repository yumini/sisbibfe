import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { EditorialService } from '../../shared/dataservices/editorial.service';
import { PaisService } from '../../shared/dataservices/pais.service';
import { IEditorial, IPais } from '../../shared/settings/interfaces';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap';
import * as _ from 'underscore';
import { PagerService } from '../../shared/dataservices/index'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TypeaheadMatch } from 'ng2-bootstrap/typeahead';

@Component({
    moduleId: 'modulo.id',
    selector: 'editorial',
    templateUrl: 'editorial.component.html'
})
export class EditorialComponent implements OnInit {
    //propiedades del componente editorial
    public nombre: string;
    public paises: any[];
    public model2: IPais;

    public editorial: IEditorial; //Objecto enviado para la API
    public alerts: any = []; //para los mensajes de alertas

    // array of all items to be paged
    private allItems: any[];

    // pager object
    public pager: any = {};

    // paged items
    public pagedItems: any[];

    @ViewChild('autoShownModal') public autoShownModal: ModalDirective;

    public isModalShown: boolean = false;
    constructor(private editorialService: EditorialService, private pagerService: PagerService, private paisService: PaisService) {

    }

    titulo1 = "LISTADO DE EDITORIALES";
    todoeditoriales = [];
    titulo_modal = "";
    ideditorial = "";
    nombreeditorial = "";
    btnguardar = "";

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
        this.cargarEditoriales();
        this.cargarPaises();

    }
    //cargar Autores
    public cargarEditoriales() {
        this.editorialService.getEditorialesTodos().subscribe((todoeditoriales: IEditorial[]) => {
            this.todoeditoriales = todoeditoriales;
            console.log('Listado de Editoriales cargado ');
            // set items to json response
            this.allItems = todoeditoriales;
            console.log(this.allItems);
            // initialize to page 1
            this.setPage(1);
        },
            error => {
                console.log('Fallo Conexion Autor ' + error);
            });
    }

    public cargarPaises() {
        this.paisService.getPaisesTodos().subscribe((paises: IPais[]) => {
            this.paises = paises;
            console.log('Listado de Paises cargado ');
            // set items to json response            
            this.paises = paises;
            console.log(paises);
        },
            error => {
                console.log('Fallo Conexion Autor ' + error);
            });
    }

    //Nuevo Editorial Constructor
    public guardar(edi: IEditorial) {
        edi.idpais = this.model2;
        this.editorial = {
            "ideditorial": edi.ideditorial,
            "nombre": edi.nombre,
            "idpais": edi.idpais
        }        
        console.log('Editorial ' + edi.nombre);
        console.log("btnguardar al guardar= " + this.btnguardar);
        if (this.btnguardar == "NEW") {
            this.editorialService.crearEditorial(this.editorial).subscribe(
                () => {
                    console.log('Editorial created successfully. ');
                    this.cargarEditoriales();
                    this.addAlert('success', 'Editorial Registrado.. Satisfactoriamente...');
                    this.hideModal();
                    this.model2 = {
                        idpais: 0 as number,
                        nombre: ""
                    };
                },
                error => {
                    console.error('Error al Crear Editorial. ' + error);
                });
        }

        if (this.btnguardar == "EDIT") {
            this.editorialService.modificarEditorial(this.editorial).subscribe(
                () => {
                    console.log('Editorial modificado successfully. ');
                    this.cargarEditoriales();
                    this.addAlert('success', 'Modificado Registrado...Satisfactoriamente...');
                    this.hideModal();
                    this.model2 = {
                        idpais: 0 as number,
                        nombre: ""
                    };
                },
                error => {
                    console.error('Error al modificar el Autor. ' + error);
                    this.addAlert('danger', '..Error Problema al registrar...');
                });
        }

    }
    //Eliminar Editorial accion
    public eliminar(id: number) {
        this.editorialService.eliminarEditorial(id).subscribe(
            () => {
                console.log('Editorial Eliminado successfully. ');
                this.cargarEditoriales();
                this.addAlert('success', 'Registro Eliminado... Satisfactoriamente...');
                this.hideChildModal();
            },
            error => {
                console.error('Error eliminar Editorial. ' + error);
            });
    }

    //Setea datos Eliminar
    public setEditorialEliminar(edito: IEditorial) {
        this.nombreeditorial = edito.nombre + ' ' + edito.nombre;
        this.ideditorial = edito.ideditorial.toString();
        this.showChildModal();
    }
    //boton Nuevo Modal
    public nuevo() {
        this.showModal("N");
        this.limpiarInterface();

    }
    //Setea el objeto a editar
    public editar(editorialeditado) {
        const editorialeditar = Object.assign({}, editorialeditado)        
        this.showModal("M");
        this.editorial = editorialeditar,
            this.editorial = {
                "ideditorial": this.editorial.ideditorial,
                "nombre": this.editorial.nombre,
                "idpais": this.editorial.idpais
            },
            this.model2 = this.editorial.idpais
    }
    //Para la alerta personalizada
    public addAlert(tipo: string, mensaje: string): void {
        this.alerts.push({
            type: tipo,
            msg: mensaje,
            timeout: 3000
        });
    }

    public limpiarInterface() {
        this.editorial = {
            "nombre": "",
            "idpais": this.model2
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

    autocompleListFormatter = (data: any) => {
        let html = `${data.nombre}`;
        return (html);
    }

}
