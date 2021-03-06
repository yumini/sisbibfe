export interface IAutor {
    id?: number;
    nombre: string;
    ape_pat: string;
    ape_mat: string;
    idpais: IPais;
}
export interface IEditorial {
    ideditorial?: number;
    nombre: string;
    idpais: IPais;
}

export interface IPais {
    idpais?: number;
    nombre: string;
}

export interface IMateria {
    idmateria?: number;
    nombre: string;
}

export interface IAnexo {
    idanexo?: number;
    nombre: string;
    ape_pat: string;
    ape_mat: string;
}

export interface IUsuario {
    idusuario?: number;
    nombre: string;
    password: string;
    idanexo: IAnexo;
}