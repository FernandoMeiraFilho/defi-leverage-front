import React, { FC, ReactElement } from "react";
import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client";
import TokenMenu from "../components/tokenMenu";
import * as _ from "lodash";
import { Grid } from "semantic-ui-react";
import ProtocolMenu from "../components/protocolMenu";

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
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column className="box" style={{ margin: 2 }} width={10}>
            <h3 className="title is-4 has-text-primary-dark">
              Leveraged token:
            </h3>
            <TokenMenu />
          </Grid.Column>
          <Grid.Column className="box" style={{ margin: 2 }} width={2}>
            <h3 className="title is-4 has-text-primary-dark">
              Protocols to include:
            </h3>
            <ProtocolMenu />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Home;
