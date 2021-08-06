import React, { FC, ReactElement } from "react";
import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client";

type BodyProps = {
  apolloClient: any;
};

const query = gql`
  query getAllCollateras {
    tokens {
      token_ERC_code
      token_address
    }
  }
`;

const Body: FC<any> = (): ReactElement => {
  const { loading, error, data } = useQuery(query, {
    variables: { language: "english" },
  });
  console.log(data.tokens);

  return (
    <div className="container is-primary">
      <div className="notification is-primary">Testando 123</div>
    </div>
  );
};

export default Body;
