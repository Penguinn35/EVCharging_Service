import type { Layer } from "leaflet";

declare module "leaflet" {
  interface HeatLayer extends Layer {
    setLatLngs(latlngs: [number, number, number?][]): this;
    addLatLng(latlng: [number, number, number?]): this;
    setOptions(options: HeatMapOptions): this;
  }

  interface HeatMapOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: Record<number, string>;
  }

  function heatLayer(latlngs: [number, number, number?][], options?: HeatMapOptions): HeatLayer;
}
