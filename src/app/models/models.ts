import { IDestino } from "../interfaces/varios";

export interface Usuario {
    email: string;
    name: string;
    lastName: string;
    uid: string;
}
export interface Viaje {
    id?: string;
    destino: IDestino;
    origen: IDestino;
    fecha: Date;
    precio: number;
    asientos: number;
    conductor: string;
    modeloAuto: string;
    patenteAuto: string;
    pasajeros: string[];
    estado: 'disponible' | 'cancelado' | 'finalizado' | 'iniciado' | 'pendiente' | 'lleno' | 'preparándose';
}

export interface Solicitud {
    id?: string;
    uidPasajero: string;
    pasajero: string;
    estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';
}

export interface Mensaje {
    id?: string;
    mensaje: string;
    remitente: string;
    timestamp?: number;
}