declare module '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions' {
    import { IControl, LngLatLike } from 'mapbox-gl';
  
    export interface MapboxDirectionsOptions {
      accessToken: string;
      unit?: 'imperial' | 'metric';
      profile?: 'mapbox/driving' | 'mapbox/walking' | 'mapbox/cycling';
      alternatives?: boolean;
      congestion?: boolean;
      interactive?: boolean;
      placeholderOrigin?: string;
      placeholderDestination?: string;
      proximity?: LngLatLike;
      language?: string;
      controls?: {
        inputs?: boolean;
        instructions?: boolean;
        profileSwitcher?: boolean;
      };
      flyTo?: boolean;
      zoom?: number;
      placeholder?: string;
      geocoder?: any;
    }
  
    export default class MapboxDirections implements IControl {
      constructor(options?: MapboxDirectionsOptions);
      onAdd(map: mapboxgl.Map): HTMLElement;
      onRemove(map: mapboxgl.Map): void;
      setOrigin(origin: LngLatLike): this;
      setDestination(destination: LngLatLike): this;
      getOrigin(): LngLatLike;
      getDestination(): LngLatLike;
      removeRoutes(): this;
      on(event: string, callback: (data?: any) => void): this;
    }
  }