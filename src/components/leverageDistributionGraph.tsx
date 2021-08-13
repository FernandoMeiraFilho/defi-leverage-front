import React, { FC, ReactElement } from "react";
import _ from "lodash";
import { gql, useQuery } from "@apollo/client";
import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type GraphProps = {
  selectedToken: string;
  selectedProtocol: string;
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

  let graphData = [];
  let maxPrice = 0;
  if (!loading) {
    for (let collateral of data.collateral) {
      graphData.push({
        ...collateral,
        liquidationPrice: Math.floor(collateral.liquidationPrice * 100) / 100,
        collateralAmount: Math.floor(collateral.collateralAmount * 100) / 100,
      });
      maxPrice =
        collateral.liquidationPRice > maxPrice
          ? collateral.liquidationPRice
          : 0;
    }

    graphData = _.orderBy(graphData, ["liquidationPrice"], ["asc"]);
  }
  console.log(graphData);

  return (
    <div className="box">
      <h1>Teste</h1>
      <ResponsiveContainer width={1335} height="90%">
        <BarChart
          data={graphData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="liquidationPrice" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Brush dataKey="liquidationPrice" height={30} stroke="#8884d8" />
          <Bar dataKey="collateralAmount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeverageDistributionGraph;
