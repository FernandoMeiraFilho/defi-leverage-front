import * as _ from "lodash";
import yAxisHelper from "./microHelpers/yAxishelper";
import xAxisHelper from "./microHelpers/xAxisHelper";

export type dataProps = {
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
    //fixing the X axis
    const maxYTickerDigits = highestYTicker.collateralAmount
      .toString()
      .split(".")[0].length;

    const { yTickerFormat, adjustedData } = yAxisHelper(data, maxYTickerDigits);

    //fixing the X axis

    const { finalData } = xAxisHelper(
      12, //seems like a good number to display things on desktop
      adjustedData,
      data,
      highestXTicker,
      lowestXTicker
    );

    return { finalData, yTickerFormat };
  }
};

export default tickerUnitHandler;
