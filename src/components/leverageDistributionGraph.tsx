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

  const graphData = [];
  if (!loading) {
    for (let collateral of data.collateral) {
      graphData.push(collateral);
    }
  }
  console.log(graphData);

  return (
    <div className="box">
      <h1>Teste</h1>
      <ResponsiveContainer width={1024} height="90%">
        <BarChart
          width={900}
          height={350}
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
          <Bar dataKey="collateralAmount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeverageDistributionGraph;
