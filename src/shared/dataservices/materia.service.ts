import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { ConfigService } from '../settings/config.service';
import { IMateria } from '../settings/interfaces';

@Injectable()
export class MateriaService {
    _baseUrl: string = '';


    constructor(private http: Http, private configService: ConfigService) {
        this._baseUrl = configService.getApiURI();
    }

    //Traer todos el listado de materias
    getMateriasTodos(): Observable<IMateria[]> {
        return this.http.get(this._baseUrl + 'materias')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }
    //crear Materia
    crearPais(materia: IMateria): Observable<IMateria> {

        let body = JSON.stringify(materia);
        console.log(body);
        var headers = new Headers();

        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this._baseUrl + 'materias', body.toString(), options)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }
    
    //Modificar Materia
    modificarMateria(materia: IMateria): Observable<void> {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(materia);
        return this.http.put(this._baseUrl + 'materias', JSON.stringify(materia), {
            headers: headers
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    //Eliminar Materia
    eliminarMateria(idmateria: number): Observable<void> {
        return this.http.delete(this._baseUrl + 'materias/' + idmateria)
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