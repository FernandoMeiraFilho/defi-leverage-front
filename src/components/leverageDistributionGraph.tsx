import React, { FC, ReactElement } from "react";
import _ from "lodash";
import { gql, useQuery } from "@apollo/client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import tickerHandler from "../handlers/tickerUnitHandler";

type GraphProps = {
  selectedToken: string;
  selectedProtocol: string;
};

const tickFormatter = (num: number) => {
  return num.toLocaleString();
};

const LeverageDistributionGraph: FC<GraphProps> = ({
  selectedToken,
  selectedProtocol,
}): ReactElement => {
  const query = gql`query getTokenLeverage {
        collateral(token_erc_code: "${selectedToken}") {
            token_erc_code
            liquidationPrice
            collateralAmount
            protocol_name
          }
      }`;

  const { loading, error, data } = useQuery(query, {
    variables: { language: "english" },
  });

  let cleanData;
  let yTickerHandle: string | undefined = "";
  let graphData = [];
  let maxPrice = 0;
  let numberOfDifferentPrices = new Set();
  if (!loading) {
    //initial raw data loading
    for (let collateral of data.collateral) {
      if (
        collateral.collateralAmount > 0.0001 &&
        collateral.liquidationPrice > 0
      ) {
        graphData.push({
          ...collateral,
          liquidationPrice:
            Math.floor(collateral.liquidationPrice * 1000) / 100,
          collateralAmount:
            Math.floor(collateral.collateralAmount * 1000) / 100,
        });
        if (collateral.liquidationPrice > maxPrice) {
          maxPrice = collateral.liquidationPrice;
        }

        numberOfDifferentPrices.add(
          Math.floor(collateral.liquidationPrice * 100) / 100
        );
      }
    }

    graphData = _.orderBy(graphData, ["liquidationPrice"], ["asc"]);

    //formating and organizing the final data to be rendered on the graph
    const { finalData, yTickerFormat } = tickerHandler(graphData);
    cleanData = finalData;
    yTickerHandle = yTickerFormat;
  }

  const finalData =
    typeof cleanData === "string" || cleanData !== undefined
      ? cleanData
      : graphData;

  let finalYticker;
  if (yTickerHandle === "") {
    finalYticker = "units";
  } else {
    finalYticker = yTickerHandle === "k" ? "thousand" : "million";
  }

  console.log(finalData);

  return (
    <div className="box">
      <h1>Teste</h1>
      <ResponsiveContainer width={1335} height="90%">
        <BarChart
          data={finalData}
          margin={{
            top: 2,
            right: 15,
            left: 15,
            bottom: 3,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            name="Liquidation Price"
            dataKey="liquidationPrice"
            tickFormatter={tickFormatter}
            label={{
              value: `Liquidation Price`,
              position: "bottom",
            }}
          />
          <YAxis
            label={{
              value: `Collateral Amount (in ${finalYticker} tokens)`,
              angle: -90,
              position: "left",
            }}
            unit={yTickerHandle}
            tickFormatter={tickFormatter}
          />
          <Tooltip />
          <Legend align="right" />
          <Bar dataKey="adjCollateralAmount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeverageDistributionGraph;
