import { WhereFilterOp } from "@angular/fire/firestore";

export interface ICollectionOpts {
    field: string, 
    opStr: WhereFilterOp, 
    value: any
}

export interface IViajesOpts extends ICollectionOpts {
    field: 'destino' | 'fecha' | 'precio' | 'asientos' | 'conductor' | 'estado' | 'modeloAuto' | 'patenteAuto' | 'comunaDestino' | 'pasajeros'
}
export interface IDireccion {
  type: string;
  query: string[];
  features: Feature[];
  attribution: string;
}

export interface Feature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: Properties;
  text: string;
  place_name: string;
  matching_text?: string;
  matching_place_name?: string;
  center: number[];
  geometry: Geometry;
  context: Context[];
}

export interface Context {
  id: string;
  text: string;
  mapbox_id?: string;
  wikidata?: string;
  short_code?: string;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {
  foursquare?: string;
  landmark?: boolean;
  category?: string;
  accuracy?: string;
  mapbox_id?: string;
  'override:postcode'?: string;
}

export interface IDestino {
  coordinates: [lng: number, lat: number];
  direccion: string;
}