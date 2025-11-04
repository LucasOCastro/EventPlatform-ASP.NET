import { render, screen, fireEvent } from "@/tests/setup";
import { LoginButton } from "./LoginButton";
import { vi } from "vitest";
import { act } from "@testing-library/react";

const BUTTON_TEXT = "Join";
const MOCKED_MODAL_ID = "mocked-modal";
vi.mock("./AuthModal.tsx", () => ({
  AuthModal: vi.fn(() => <div data-testid={"mocked-modal"}>MOCKED</div>),
}));

describe("LoginButton", () => {
  it("spells Join", () => {
    render(<LoginButton />);

    const button = screen.getByText(BUTTON_TEXT);
    expect(button).toBeInTheDocument();
  });

  it("opens the auth modal on click", async () => {
    render(<LoginButton />);

    expect(screen.queryByTestId(MOCKED_MODAL_ID)).toBeNull();
    await act(() => fireEvent.click(screen.getByRole("button")));
    expect(await screen.findByTestId(MOCKED_MODAL_ID)).toBeInTheDocument();
  });
});
