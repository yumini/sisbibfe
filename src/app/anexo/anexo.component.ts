import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { IAnexo } from '../../shared/settings/interfaces';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap';
import * as _ from 'underscore';
import { PagerService } from '../../shared/dataservices/index';
import { AnexoService } from '../../shared/dataservices/anexo.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TypeaheadMatch } from 'ng2-bootstrap/typeahead';

@Component({
    moduleId: 'modulo.id',
    selector: 'anexo',
    templateUrl: 'anexo.component.html'
})
export class AnexoComponent implements OnInit {
    //propiedades del componente autor
    public nombre: string;
    public ape_pat: string;
    public ape_mat: string;    

    public anexo: IAnexo; //Objecto enviado para la API
    public alerts: any = []; //para los mensajes de alertas

    // array of all items to be paged
    private allItems: any[];
    // pager object
    public pager: any = {};
    // paged items
    public pagedItems: any[];

    @ViewChild('autoShownModal') public autoShownModal: ModalDirective;

    public isModalShown: boolean = false;
    constructor(private anexoService: AnexoService, private pagerService: PagerService) {

    }

    titulo1 = "LISTADO DE ANEXOS";
    todoanexos = [];
    titulo_modal = "";
    idanexo = "";
    nombreanexo = "";
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
        this.cargarAnexos();        

    }
    //cargar Autores
    public cargarAnexos() {
        this.anexoService.getAnexosTodos().subscribe((todoanexos: IAnexo[]) => {
            this.todoanexos = todoanexos;
            console.log('Listado de Anexos cargado ');
            // set items to json response
            this.allItems = todoanexos;
            console.log(this.allItems);
            // initialize to page 1
            this.setPage(1);
        },
            error => {
                console.log('Fallo Conexion Anexo ' + error);
            });
    }

    //Nuevo Anexo Constructor
    guardar(ane: IAnexo) {
        this.anexo = {
            "idanexo": ane.idanexo,
            "nombre": ane.nombre,
            "ape_pat": ane.ape_pat,
            "ape_mat": ane.ape_mat            
        }        
        console.log("btnguardar al guardar= " + this.btnguardar);
        if (this.btnguardar == "NEW") {
            this.anexoService.crearAnexo(this.anexo).subscribe(
                () => {
                    console.log('Anexo created successfully. ');
                    this.cargarAnexos();
                    this.addAlert('success', 'Anexo Registrado.. Satisfactoriamente...');
                    this.hideModal();                    
                },
                error => {
                    console.error('Error al Crear el Anexo. ' + error);
                });
        }

        if (this.btnguardar == "EDIT") {
            this.anexoService.modificarAnexo(this.anexo).subscribe(
                () => {
                    console.log('Anexo modificado successfully. ');
                    this.cargarAnexos();
                    this.addAlert('success', 'Modificado Registrado...Satisfactoriamente...');
                    this.hideModal();
                },
                error => {
                    console.error('Error al modificar el Anexo. ' + error);
                    this.addAlert('danger', '..Error Problema al registrar...');
                });
        }

    }
    //Eliminar autor accion
    public eliminar(id: number) {
        this.anexoService.eliminarAnexo(id).subscribe(
            () => {
                console.log('Anexo Eliminado successfully. ');
                this.cargarAnexos();
                this.addAlert('success', 'Registro Eliminado... Satisfactoriamente...');
                this.hideChildModal();
            },
            error => {
                console.error('Error eliminar el Autor. ' + error);
            });
    }

    //Setea datos Eliminar
    public setAnexoEliminar(an: IAnexo) {
        this.nombreanexo = an.nombre + ' ' + an.ape_pat + ' ' + an.ape_pat;
        this.idanexo = an.idanexo.toString();
        this.showChildModal();
    }
    //boton Nuevo Modal
    public nuevo() {
        this.showModal("N");
        this.limpiarInterface();

    }
    //Setea el objeto a editar
    public editar(anexoeditado) {
        const anexoeditar = Object.assign({}, anexoeditado)        
        this.showModal("M");
        this.anexo = anexoeditar,
            this.anexo = {
                "idanexo": this.anexo.idanexo,
                "nombre": this.anexo.nombre,
                "ape_pat": this.anexo.ape_pat,
                "ape_mat": this.anexo.ape_mat                
            }            
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
        this.anexo = {
            "nombre": "",
            "ape_pat": "",
            "ape_mat": ""            
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
