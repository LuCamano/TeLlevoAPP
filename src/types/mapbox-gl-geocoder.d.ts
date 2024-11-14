/// <reference types="geojson" />

declare module '@mapbox/mapbox-gl-geocoder' {
    import { LngLatLike, Map, IControl } from 'mapbox-gl';
  
    export interface GeocoderOptions {
      accessToken: string;
      origin?: string;
      placeholder?: string;
      language?: string;
      zoom?: number;
      flyTo?: boolean;
      mapboxgl?: typeof mapboxgl;
      marker?: boolean | Object;
      bbox?: [number, number, number, number];
      types?: string;
      minLength?: number;
      limit?: number;
      filter?: (feature: any) => boolean;
      localGeocoder?: (query: string) => any[];
      proximity?: LngLatLike;
      countries?: string;
      render?: (feature: any) => string;
      getItemValue?: (feature: any) => string;
      clearOnBlur?: boolean;
      collapsed?: boolean;
      clearAndBlurOnEsc?: boolean;
      enableEventLogging?: boolean;
      externalGeocoder?: (query: string) => Promise<any>;
      fuzzyMatch?: boolean;
      autocomplete?: boolean;
      routing?: boolean;
      worldview?: string;
    }
  
    export default class MapboxGeocoder implements IControl {
      constructor(options?: Partial<GeocoderOptions>);
      onAdd(map: Map): HTMLElement;
      onRemove(map: Map): void;
      setProximity(proximity: LngLatLike): void;
      getProximity(): LngLatLike;
      setRenderFunction(fn: (feature: any) => string): void;
      setLanguage(language: string): void;
      setZoom(zoom: number): void;
      setFlyTo(flyTo: boolean): void;
      setPlaceholder(placeholder: string): void;
      setCountries(countries: string): void;
      setTypes(types: string): void;
      setMinLength(minLength: number): void;
      setLimit(limit: number): void;
      setFilter(filter: (feature: any) => boolean): void;
      setOrigin(origin: string): void;
      setAutocomplete(autocomplete: boolean): void;
      setFuzzyMatch(fuzzyMatch: boolean): void;
      setRouting(routing: boolean): void;
      setWorldview(worldview: string): void;
      query(query: string): void;
      suggest(query: string): void;
      setInput(value: string): void;
      getInput(): string;
      clear(): void;
      clearSuggestions(): void;
    }
  }