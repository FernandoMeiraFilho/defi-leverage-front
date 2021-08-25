import * as _ from "lodash";
import { dataProps } from "../tickerUnitHandler";

const xAxisHelper = (
  maxXtickers: number,
  adjustedData: any,
  data: any,
  highestXTicker: dataProps,
  lowestXTicker: dataProps
) => {
  //check how many different prices are

  let finalData;
  if (adjustedData.length <= maxXtickers) {
    finalData = _.map(adjustedData, (obj) => {
      return {
        ...obj,
      };
    });
  } else {
    const topTicker = highestXTicker.liquidationPrice;
    const lowestTicker = lowestXTicker.liquidationPrice;
    const topBottomDiff = topTicker - lowestTicker;
    const incrementAggregator = topBottomDiff / maxXtickers;

    // creating a array with the thresholds to aggregate price
    const thresholdArray = [];
    let incrementMemory = lowestTicker;
    for (let i = 0; i < maxXtickers; i++) {
      thresholdArray.push((incrementMemory += incrementAggregator));
    }

    // aggregating the prices

    let liquidationPriceLow = lowestTicker;
    const formedData = [];
    let soma = 0;
    let index = 0;
    for (let threshold of thresholdArray) {
      index += 1;
      const tickerDetailed = [];
      let totalCollateralAmount = 0;
      let lastThresholdPrice = 0;

      for (let blob of adjustedData) {
        if (index === maxXtickers) {
          if (blob.liquidationPrice > liquidationPriceLow) {
            totalCollateralAmount += blob.adjCollateralAmount;
            tickerDetailed.push(blob);
            lastThresholdPrice = blob.liquidationPrice;
            soma += blob.adjCollateralAmount;
          }
        } else {
          if (
            blob.liquidationPrice > liquidationPriceLow &&
            blob.liquidationPrice <= threshold
          ) {
            totalCollateralAmount += blob.adjCollateralAmount;
            tickerDetailed.push(blob);
            lastThresholdPrice = blob.liquidationPrice;
            soma += blob.adjCollateralAmount;
          }
        }
      }

      // if there are no data on this group we should use the threshold as the max..
      lastThresholdPrice =
        lastThresholdPrice === 0 ? threshold : lastThresholdPrice;

      // formatting the xTickers when they are big
      const lowerBoundDigits = liquidationPriceLow
        .toString()
        .split(".")[0].length;
      const upperBoundDigits = lastThresholdPrice
        .toString()
        .split(".")[0].length;

      let liquidationPriceString;
      console.log(topTicker);
      if (lowerBoundDigits > 3 || upperBoundDigits > 3) {
        if (topTicker.toString().split(".")[0].length <= 4) {
          liquidationPriceString = `${
            Math.floor(liquidationPriceLow / 100) / 10
          }k to ${Math.floor(lastThresholdPrice / 100) / 10}k`;
        } else {
          liquidationPriceString = `${Math.floor(
            Math.floor(liquidationPriceLow / 10) / 100
          )}k to ${Math.floor(Math.floor(lastThresholdPrice / 10) / 100)}k`;
        }
      } else {
        liquidationPriceString = `${
          Math.floor(Math.floor(liquidationPriceLow * 100) / 10) / 10
        } to ${Math.floor(lastThresholdPrice * 10) / 10}`;
      }
      // FINAL OBJECT
      formedData.push({
        liquidationPrice: liquidationPriceString,
        adjCollateralAmount: totalCollateralAmount,
        detailedAmounts: tickerDetailed,
        token_erc_code: data[0].token_erc_code,
        protocol_name: data[0].protocol_name,
      });
      liquidationPriceLow = threshold;
      finalData = formedData;
    }
  }
  return { finalData };
};

export default xAxisHelper;
