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
    console.log(maxYTickerDigits);

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
    const maxXtickers = 15; //seems like a good number on desktop for display purposes

    if (adjustedData.length <= maxXtickers) {
      adjustedData = _.map(data, (obj) => {
        return {
          ...obj,
          adjCollateralAmount: obj.collateralAmount,
          aggLiquidationPrice: obj.liquidationPrice,
        };
      });
    } else {
      const topTicker = highestXTicker.liquidationPrice;
      const lowestTicker = lowestXTicker.liquidationPrice;
      const topBottomDiff = topTicker - lowestTicker;
      const incrementAggregator = topBottomDiff / maxXtickers;

      const thresholdArray = [];
      let incrementMemory = lowestTicker;
      for (let i = 0; i < maxXtickers; i++) {
        thresholdArray.push((incrementMemory += incrementAggregator));
      }
      console.log(`minTicker: ${lowestTicker}, maxTicker: ${topTicker}`);
      console.log("threshold array", thresholdArray);
    }

    return { adjustedData, yTickerFormat };
  }
};

export default tickerUnitHandler;
