import * as _ from "lodash";

const yAxisHelper = (data: any, maxYTickerDigits: number) => {
  let yTickerFormat = "";
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

  return { yTickerFormat, adjustedData };
};

export default yAxisHelper;
