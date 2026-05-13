import * as L from "leaflet";

declare module "leaflet" {
  namespace Routing {
    interface RoutingControlOptions {
      waypoints?: L.LatLng[];
      router?: IRouter;
      show?: boolean;
      addWaypoints?: boolean;
      draggableWaypoints?: boolean;
      fitSelectedRoutes?: boolean;
    }

    type IRouter = object;

    function control(options: RoutingControlOptions): L.Control;
    function graphHopper(apiKey: string | undefined, options?: object): IRouter;
  }
}

declare module "leaflet-routing-machine" {}
declare module "lrm-graphhopper" {}

