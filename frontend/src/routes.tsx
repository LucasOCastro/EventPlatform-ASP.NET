import { createBrowserRouter } from "react-router";
import { Home } from "@/pages/home/Home.tsx";
import { About } from "@/pages/about/About.tsx";
import { ErrorPage } from "@/pages/ErrorPage/ErrorPage.tsx";
import { Root } from "@/components/Root.tsx";
import type { MyRouteObject, RouteInfo } from "@/types/routes.ts";

const routeRoot: MyRouteObject = {
  path: "/",
  element: <Root />,
  errorElement: <ErrorPage />,
  children: [
    {
      index: true,
      element: <Home />,
      // lazy: () => import("@/pages/home/Home.tsx")
      handle: { label: "Home", showInNavbar: true },
    },
    {
      path: "/about",
      element: <About />,
      handle: { label: "About", showInNavbar: true },
    },
    {
      path: "/*",
      element: <ErrorPage />,
    },
  ],
};

export const router = createBrowserRouter([routeRoot]);

function* traverse(
  routeObject: MyRouteObject,
  currentPath: string,
): Generator<RouteInfo> {
  const { path = "", handle, element, children = [] } = routeObject;
  const fullPath = `${currentPath}/${path}`.replace(/\/+/g, "/");

  if (element) {
    yield { fullPath, handle };
  }

  for (const child of children) {
    yield* traverse(child, fullPath);
  }
}

export const allRoutes = Array.from(traverse(routeRoot, ""));
