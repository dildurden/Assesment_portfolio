import { render, screen, fireEvent } from "@testing-library/react";
import { PortfolioForm } from "./PortfolioForm";

describe("PortfolioForm", () => {
  test("renders form and updates input fields", () => {
    const onChangeSymbols = jest.fn();
    const onChangeStartDate = jest.fn();
    const onChangeEndDate = jest.fn();
    const onChangeInvestment = jest.fn();

    render(
      <PortfolioForm
        allSymbols={["AAPL", "GOOG"]}
        selectedSymbols={["AAPL"]}
        startDate="2025-01-01"
        endDate="2025-01-10"
        investment={1000}
        onChangeSymbols={onChangeSymbols}
        onChangeStartDate={onChangeStartDate}
        onChangeEndDate={onChangeEndDate}
        onChangeInvestment={onChangeInvestment}
      />
    );

    const investmentInput = screen.getByLabelText(/investment amount/i);
    fireEvent.change(investmentInput, { target: { value: "2000" } });
    expect(onChangeInvestment).toHaveBeenCalled();
  });
});
