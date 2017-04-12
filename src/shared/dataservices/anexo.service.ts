import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { ConfigService } from '../settings/config.service';
import { IAnexo } from '../settings/interfaces';

@Injectable()
export class AnexoService {
    _baseUrl: string = '';


    constructor(private http: Http, private configService: ConfigService) {
        this._baseUrl = configService.getApiURI();
    }

    //Traer todos el listado de anexos
    public getAnexosTodos(): Observable<IAnexo[]> {
        return this.http.get(this._baseUrl + 'anexos')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }
    //crear Anexo
    public crearAnexo(anexo: IAnexo): Observable<IAnexo> {

        let body = JSON.stringify(anexo);
        console.log(body);
        var headers = new Headers();

        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this._baseUrl + 'anexos', body.toString(), options)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }
    
    //Modificar Anexo
    public modificarAnexo(anexo: IAnexo): Observable<void> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl + 'anexos' , JSON.stringify(anexo), {
            headers: headers
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    //Eliminar anexo
    public eliminarAnexo(id: number): Observable<void> {
        return this.http.delete(this._baseUrl + 'anexos/' + id)
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