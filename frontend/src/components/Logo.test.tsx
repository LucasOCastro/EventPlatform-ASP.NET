import { render, screen } from "@/tests/setup";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("should render an image", () => {
    render(<Logo />);

    const logoImage = screen.getByRole("img");

    expect(logoImage).toBeInTheDocument();
  });
});
