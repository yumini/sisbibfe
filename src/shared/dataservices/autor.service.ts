import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { ConfigService } from '../settings/config.service';
import { IAutor } from '../settings/interfaces';

@Injectable()
export class AutorService {
    _baseUrl: string = '';


    constructor(private http: Http, private configService: ConfigService) {
        this._baseUrl = configService.getApiURI();
    }

    //Traer todos el listado de autores
    getAutoresTodos(): Observable<IAutor[]> {
        return this.http.get(this._baseUrl + 'autores')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }
    //crear Autor
    crearAutor(autor: IAutor): Observable<IAutor> {

        let body = JSON.stringify(autor);
        console.log(body);
        var headers = new Headers();

        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this._baseUrl + 'autores', body.toString(), options)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }
    
    //Modificar Autor
    modificarAutor(autor: IAutor): Observable<void> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl + 'autores' , JSON.stringify(autor), {
            headers: headers
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    //Eliminar autor
    eliminarAutor(id: number): Observable<void> {
        return this.http.delete(this._baseUrl + 'autores/' + id)
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }
    
    //si ocurre algun error
    private handleError(error: any) {
        var applicationError = error.headers.get('Application-Error');
        var serverError = error.json();
        var modelStateErrors: string = '';

        if (!serverError.type) {
            console.log('Se detecto un Error' + serverError);

            for (var key in serverError) {
                if (serverError[key])
                    modelStateErrors += serverError[key] + '\n';
            }
        }

        modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;

        return Observable.throw(applicationError || modelStateErrors || 'Server error');
    }


}