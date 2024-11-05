export interface blog{
    id:number,
    titulo: string,
    contenido: string,
    idUsuario: number,
    fechaPublicacion: Date,
    estado:string,
    nombreAutor: string,
    categoriaId: number,
    nombreCategoria: string
}