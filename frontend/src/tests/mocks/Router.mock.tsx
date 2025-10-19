import { createRoutesStub, type RoutesTestStubProps } from "react-router";
import React from "react";
import { screen } from "@testing-library/react";

type RouteObject<TPath extends string> = { path: TPath; Component: React.FC };
type Route<TPath extends string> = TPath | RouteObject<TPath>;
type Routes<TPath extends string> = Route<TPath>[];

export class RouterMock<TPath extends string> {
  private readonly _stub: React.FC<RoutesTestStubProps>;

  constructor(routes: Routes<TPath>) {
    this._stub = createRoutesStub(routes.map(makeRouteObject));
  }

  public render(startingPath: TPath) {
    return <this._stub initialEntries={[startingPath]} />;
  }

  public async expectRouteActive(route: TPath): Promise<void> {
    const testId = makeTestId(route);
    return expect(await screen.findByTestId(testId)).toBeInTheDocument();
  }
}

function makeRouteObject<TPath extends string>(
  route: Route<TPath>,
): RouteObject<TPath> {
  if (typeof route !== "string") {
    return route;
  }

  return {
    path: route,
    Component: () => <div data-testid={makeTestId(route)} />,
  };
}

function makeTestId(route: string) {
  return route.replace(/\//g, "-");
}
