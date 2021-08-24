import * as _ from "lodash";

type dataProps = {
  token_erc_code: string;
  liquidationPrice: number;
  collateralAmount: number;
  protocol_name: string;
};

const tickerUnitHandler = (data: dataProps[]) => {
  const highestXTicker = _.last(data);
  const lowestXTicker = data[0];
  const highestYTicker = _.last(_.orderBy(data, ["collateralAmount"], ["asc"]));

  if (highestXTicker === undefined || highestYTicker === undefined) {
    return {
      adjustedData: [],
      err1: "",
    };
  } else {
    const maxXTickerDigits = highestXTicker.liquidationPrice
      .toString()
      .split(".")[0].length;

    const maxYTickerDigits = highestYTicker.collateralAmount
      .toString()
      .split(".")[0].length;

    let yTickerFormat = "";

    //fixing the Y axis
    let adjustedData;
    if (maxYTickerDigits - 1 >= 3 && maxYTickerDigits - 1 < 6) {
      adjustedData = _.map(data, (obj) => {
        yTickerFormat = "k";
        return {
          ...obj,
          adjCollateralAmount:
            Math.floor((obj.collateralAmount / 10 ** 3) * 100) / 100,
        };
      });
    } else if (maxYTickerDigits - 1 >= 6) {
      adjustedData = _.map(data, (obj) => {
        yTickerFormat = "MM";
        return {
          ...obj,
          adjCollateralAmount:
            Math.floor((obj.collateralAmount / 10 ** 6) * 100) / 100,
        };
      });
    } else {
      adjustedData = _.map(data, (obj) => {
        return {
          ...obj,
          adjCollateralAmount: obj.collateralAmount,
        };
      });
    }

    //fixing the X axis

    //check how many different prices are
    const maxXtickers = 12; //seems like a good number on desktop for display purposes
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
        formedData.push({
          liquidationPrice: `${
            Math.floor(liquidationPriceLow * 100) / 100
          } to ${lastThresholdPrice}`,
          adjCollateralAmount: totalCollateralAmount,
          detailedAmounts: tickerDetailed,
          token_erc_code: data[0].token_erc_code,
          protocol_name: data[0].protocol_name,
        });
        liquidationPriceLow = threshold;
        finalData = formedData;
      }
    }

    return { finalData, yTickerFormat };
  }
};

export default tickerUnitHandler;
