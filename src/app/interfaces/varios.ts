import { WhereFilterOp } from "@angular/fire/firestore";

export interface ICollectionOpts {
    field: string, 
    opStr: WhereFilterOp, 
    value: any
}

export interface IViajesOpts extends ICollectionOpts {
    field: 'destino' | 'fecha' | 'precio' | 'asientos' | 'conductor' | 'estado'
}