import React, { FC, ReactElement } from "react";
import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client";
import TokenMenu from "../components/tokenMenu";
import * as _ from "lodash";

const query = gql`
  query getAllTokens {
    tokens {
      token_ERC_code
      token_address
    }
  }
`;

const Home: FC<any> = (): ReactElement => {
  const { loading, error, data } = useQuery(query, {
    variables: { language: "english" },
  });

  let tokens = [];
  if (!loading) {
    for (let token of data.tokens) {
      tokens.push({
        tokenName: token.token_ERC_code,
        tokenAddress: token.token_address,
      });
    }
  }

  return (
    <div className="container">
      <TokenMenu tokenList={tokens} loading={loading} />
    </div>
  );
};

export default Home;
