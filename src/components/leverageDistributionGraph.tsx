import React, { FC, ReactElement } from "react";
import { Menu } from "semantic-ui-react";
import _ from "lodash";
import { gql, useQuery } from "@apollo/client";

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

  if (!loading) {
    console.log(data.collateral);
  }

  return (
    <div className="container ">
      <h1>Teste</h1>
    </div>
  );
};

export default LeverageDistributionGraph;
