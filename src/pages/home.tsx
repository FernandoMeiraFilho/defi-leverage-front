import React, { FC, ReactElement, useState } from "react";
import { gql } from "@apollo/client/core";
import TokenMenu from "../components/tokenMenu";
import * as _ from "lodash";
import { Grid } from "semantic-ui-react";
import ProtocolMenu from "../components/protocolMenu";

const Home: FC<any> = (): ReactElement => {
  const [selectedToken, setSelectedToken] = useState("DAI");
  const [selectedProtocol, setSelectedProtocol] = useState("ALL");

  console.log(selectedToken, selectedProtocol);

  return (
    <div className="container">
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column className="box" style={{ margin: 2 }} width={10}>
            <h3 className="title is-4 has-text-primary-dark">
              Leveraged token:
            </h3>
            <TokenMenu setSelectedToken={setSelectedToken} />
          </Grid.Column>
          <Grid.Column className="box" style={{ margin: 2 }} width={2}>
            <h3 className="title is-4 has-text-primary-dark">
              Protocols to include:
            </h3>
            <ProtocolMenu setSelectedProtocol={setSelectedProtocol} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Home;
