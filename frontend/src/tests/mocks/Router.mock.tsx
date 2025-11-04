import { createRoutesStub, type RoutesTestStubProps } from "react-router";
import React, {type FC} from "react";
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
    const element = await screen.findByTestId(testId);
    expect(element).toBeInTheDocument();
    expect(element).toBeVisible();
  }
}

function makeRouteObject<TPath extends string>(
  route: Route<TPath>,
): RouteObject<TPath> {
  const path = typeof route === "string" ? route : route.path;
  const InnerComponent = typeof route === "string" ? () => null : route.Component;

  const WrappedComponent: FC = () => (
      <div data-testid={makeTestId(path)}>
        <InnerComponent />
      </div>
  );

  return {
    path,
    Component: WrappedComponent,
  };
}

function makeTestId(route: string) {
  return route.replace(/\//g, "-");
}
