export interface IAutor{
    id?:number;
    nombre:string;
    ape_pat:string;
    ape_mat:string;
    idpais: IPais;
}

export interface IPais{
    idpais?:number;
    nombre:string;    
}