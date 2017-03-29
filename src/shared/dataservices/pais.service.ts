import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { ConfigService } from '../settings/config.service';
import { IPais } from '../settings/interfaces';

@Injectable()
export class PaisService {
    _baseUrl: string = '';


    constructor(private http: Http, private configService: ConfigService) {
        this._baseUrl = configService.getApiURI();
    }

    //Traer todos el listado de paises
    getPaisesTodos(): Observable<IPais[]> {
        return this.http.get(this._baseUrl + 'paises')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }
    //crear Pais
    crearPais(pais: IPais): Observable<IPais> {

        let body = JSON.stringify(pais);
        console.log(body);
        var headers = new Headers();

        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this._baseUrl + 'paises', body.toString(), options)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }
    
    //Modificar Pais
    modificarPais(pais: IPais): Observable<void> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(pais);
        return this.http.put(this._baseUrl + 'paises', JSON.stringify(pais), {
            headers: headers
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    //Eliminar Pais
    eliminarPais(idpais: number): Observable<void> {
        return this.http.delete(this._baseUrl + 'paises/' + idpais)
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
            console.log('Se detectó un Error' + serverError);

            for (var key in serverError) {
                if (serverError[key])
                    modelStateErrors += serverError[key] + '\n';
            }
        }

        modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;

        return Observable.throw(applicationError || modelStateErrors || 'Server error');
    }

}