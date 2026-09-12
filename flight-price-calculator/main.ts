// Create a flight price calculator.

// Consider data like the cost per hour of the flight, the number of passengers,
// eventual taxes, cost per passengers.
// Also be careful about considerations like currency and time.

interface RatedPrice {
  name: string;
  rate: number;
}

interface Price {
  value: number;
  currency: string;
}

interface Params {
  engineCostPerHour: Price;
  departureTime: Date;
  landingTime: Date;
  nbOfPassengers: number;
  costPerPassengers: Price[];
  taxes: RatedPrice[];
  margin: RatedPrice;
}

type PriceLine =
  | { operator: "+"; price: Price }
  | { operator: "*"; price: RatedPrice };

class ComputingHelpers {
  static getCurrentRate(
    originalCurrency: string,
    targetCurrency: string,
  ): number {
    if (originalCurrency === targetCurrency) {
      return 1;
    }

    // In reality, call API to get the current market rate
    return 0.5;
  }

  static convertCurrency(price: Price, targetCurrency: string): Price {
    const currentRate = ComputingHelpers.getCurrentRate(
      price.currency,
      targetCurrency,
    );
    const newPrice: Price = {
      value: price.value * currentRate,
      currency: targetCurrency,
    };
    return newPrice;
  }

  static getDurationFlight(departureTime: Date, landingTime: Date) {
    return (landingTime.valueOf() - departureTime.valueOf()) / (1000 * 60 * 60);
  }
}

class FlightPriceCalculator {
  private priceLines: PriceLine[] = [];

  public constructor(params: Params) {
    this.computeUnitCost(
      params.engineCostPerHour,
      ComputingHelpers.getDurationFlight(
        params.departureTime,
        params.landingTime,
      ),
    );
    params.costPerPassengers.forEach((cost) =>
      this.computeUnitCost(cost, params.nbOfPassengers),
    );
    this.computeRatedCost(params.margin);
    params.taxes.forEach((tax) => this.computeRatedCost(tax));
  }

  private addPriceLine(price: Price, priceLine: PriceLine): void {
    switch (priceLine.operator) {
      case "+":
        const convertedPrice = ComputingHelpers.convertCurrency(
          priceLine.price,
          price.currency,
        );
        price.value = price.value + convertedPrice.value;
        break;
      case "*":
        price.value = price.value * priceLine.price.rate;
        break;
    }
  }

  public computeFlightPrice(currency: string): Price {
    const finalPrice: Price = {
      value: 0,
      currency,
    };

    this.priceLines.forEach((priceLine) =>
      this.addPriceLine(finalPrice, priceLine),
    );

    return finalPrice;
  }

  public getHistory(): PriceLine[] {
    return this.priceLines;
  }

  private computeUnitCost(costPerUnit: Price, nbOfUnits: number): void {
    const newPriceLine: PriceLine = {
      price: {
        value: costPerUnit.value * nbOfUnits,
        currency: costPerUnit.currency,
      },
      operator: "+",
    };

    this.priceLines.push(newPriceLine);
  }

  private computeRatedCost(ratedPrice: RatedPrice): void {
    if (ratedPrice.rate < 1 || ratedPrice.rate >= 2) {
      throw RangeError(
        `Rate is incorrect for ${ratedPrice.name}. Should be between 1 and 2 but got ${ratedPrice.rate}`,
      );
    }

    const newPriceLine: PriceLine = {
      operator: "*",
      price: ratedPrice,
    };

    this.priceLines.push(newPriceLine);
  }
}

//const calculator = new FlightPriceCalculator();
