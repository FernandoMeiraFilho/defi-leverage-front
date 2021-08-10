import React, { FC, ReactElement, useState } from "react";
import { Menu } from "semantic-ui-react";
import _ from "lodash";

type tokenParams = {
  tokenList: {
    tokenName: any;
    tokenAddress: any;
  }[];
  loading: boolean;
};

const TokenMenu: FC<tokenParams | undefined> = ({
  tokenList,
  loading,
}): ReactElement => {
  const [activeItem, setActiveItem] = useState("DAI");
  const handleClick = (e: any, data: any) => {
    setActiveItem(data.name);
  };
  const noDuplicatesList = _.orderBy(
    _.uniqBy(tokenList, "tokenName"),
    "tokenName"
  );
  console.log(noDuplicatesList);

  return (
    <div className="container">
      <Menu secondary>
        {_.map(noDuplicatesList, (token) => {
          return (
            <Menu.Item
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
