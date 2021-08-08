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
  const [activeItem, setActiveItem] = useState(tokenList[0]["tokenName"]);
  const handleClick = (e: any, data: any) => {
    setActiveItem(data.name);
  };
  console.log(tokenList);
  return (
    <div className="container">
      <Menu secondary>
        {_.map(tokenList, (token) => {
          return (
            <Menu.Item
              name={token.tokenName}
              active={activeItem === token.tokenName}
              onClick={handleClick}
            />
          );
        })}
      </Menu>
    </div>
  );
};

export default TokenMenu;
