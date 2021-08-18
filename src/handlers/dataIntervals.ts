import * as _ from "lodash";

type dataHandlerProps = {
  numberOfIntervals: number;
  collateralData: {
    __typename: string;
    collateralAmount: number;
    liquidationPrice: number;
    protocol_name: string;
    token_erc_code: string;
  }[];
};

const intervalHandler = (dataHandlerProps: dataHandlerProps) => {};

export default intervalHandler;
