import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { ConfigService } from '../settings/config.service';
import { IEditorial } from '../settings/interfaces';

@Injectable()
export class EditorialService {
    _baseUrl: string = '';


    constructor(private http: Http, private configService: ConfigService) {
        this._baseUrl = configService.getApiURI();
    }

    //Traer todos el listado de editoriales
    getEditorialesTodos(): Observable<IEditorial[]> {
        return this.http.get(this._baseUrl + 'editoriales')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }
    //crear Editorial
    crearEditorial(editorial: IEditorial): Observable<IEditorial> {

        let body = JSON.stringify(editorial);
        console.log(body);
        var headers = new Headers();

        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this._baseUrl + 'editoriales', body.toString(), options)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }
    
    //Modificar Editorial
    modificarEditorial(editorial: IEditorial): Observable<void> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl + 'editoriales' , JSON.stringify(editorial), {
            headers: headers
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    //Eliminar editorial
    eliminarEditorial(id: number): Observable<void> {
        return this.http.delete(this._baseUrl + 'editoriales/' + id)
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