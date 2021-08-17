import * as _ from "lodash";

type dataProps = {
  token_erc_code: string;
  liquidationPrice: number;
  collateralAmount: number;
  protocol_name: string;
};

const tickerUnitHandler = (data: dataProps[]) => {
  const highestXTicker = _.last(data);
  const highestYTicker = _.last(_.orderBy(data, ["collateralAmount"], ["asc"]));

  if (highestXTicker === undefined || highestYTicker === undefined) {
    return {
      adjustedData: "unable to get the highest values for X AND/OR Y axis",
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
    if (maxYTickerDigits >= 3 && maxYTickerDigits < 6) {
      adjustedData = _.map(data, (obj) => {
        yTickerFormat = "k";
        return {
          ...obj,
          adjCollateralAmount:
            Math.floor((obj.collateralAmount / 10 ** 3) * 100) / 100,
        };
      });
    } else if (maxYTickerDigits >= 6) {
      adjustedData = _.map(data, (obj) => {
        yTickerFormat = "mil";
        return {
          ...obj,
          adjCollateralAmount:
            Math.floor((obj.collateralAmount / 10 ** 3) * 100) / 100,
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
    //check the max price number of non-decimal digitis
    //if too big create intervals, if not, use the prices as is
    // for interval graphs create objet to handle custom tooltips with the highest value holders inside the interval

    return { adjustedData, yTickerFormat };
  }
};

export default tickerUnitHandler;
