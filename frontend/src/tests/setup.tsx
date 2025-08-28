import { afterEach, vi } from "vitest";
import { cleanup, render, type RenderOptions } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import type { ReactElement } from "react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/vitest";
import createFetchMock from "vitest-fetch-mock";
import "@/plugins/setup";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

afterEach(() => {
  cleanup();
});

function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(ui, {
    wrapper: ({ children }) => (
      <MantineProvider>
        <ModalsProvider>{children}</ModalsProvider>
      </MantineProvider>
    ),
    ...options,
  });
}

export * from "@testing-library/react";
export { customRender as render };
