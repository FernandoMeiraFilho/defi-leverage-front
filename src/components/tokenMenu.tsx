import React, { FC, ReactElement, useState } from "react";
import { Menu } from "semantic-ui-react";
import _ from "lodash";
import { gql, useQuery } from "@apollo/client";

const query = gql`
  query getAllTokens {
    tokens {
      token_ERC_code
      token_address
    }
  }
`;

const TokenMenu: FC<any> = ({ setSelectedToken }): ReactElement => {
  const [activeItem, setActiveItem] = useState("DAI");
  const handleClick = (e: any, data: any) => {
    setActiveItem(data.name);
    setSelectedToken(data.name);
  };

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

  const noDuplicatesList = _.orderBy(
    _.uniqBy(tokens, "tokenName"),
    "tokenName"
  );

  return (
    <div className="container ">
      <Menu className="container is-flex-wrap-wrap" secondary>
        {_.map(noDuplicatesList, (token) => {
          return (
            <Menu.Item
              className=""
              name={token.tokenName}
              active={activeItem === token.tokenName}
              onClick={handleClick}
              key={token.tokenAddress}
            />
          );
        })}
      </Menu>
    </div>
  );
};

export default TokenMenu;
