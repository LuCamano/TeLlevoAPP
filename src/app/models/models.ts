export interface Usuario {
    email: string;
    name: string;
    lastName: string;
    uid: string;
}
export interface Viaje {
    id: string;
    destino: string;
    fecha: Date;
    precio: number;
    asientos: number;
    conductor: string;
}