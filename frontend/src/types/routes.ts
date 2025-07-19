import type { IndexRouteObject, NonIndexRouteObject } from "react-router";

export interface RouteHandle {
  label?: string;
  showInNavbar?: boolean;
  requiresAuth?: boolean;
}

type MyIndexRouteObject = IndexRouteObject & { handle?: RouteHandle };
type MyNonIndexRouteObject = NonIndexRouteObject & { handle?: RouteHandle };
export type MyRouteObject = MyIndexRouteObject | MyNonIndexRouteObject;

export interface RouteInfo {
  fullPath: string;
  handle: RouteHandle;
}
