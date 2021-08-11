import React, { FC, ReactElement, useState } from "react";
import { Menu } from "semantic-ui-react";
import _ from "lodash";
import { gql, useQuery } from "@apollo/client";

const query = gql`
  query getAllProtocols {
    protocols {
      name
    }
  }
`;

const ProtocolMenu: FC<any> = ({ setSelectedProtocol }): ReactElement => {
  const [activeItem, setActiveItem] = useState("ALL");
  const handleClick = (e: any, data: any) => {
    setActiveItem(data.name);
    setSelectedProtocol(data.name);
  };

  const { loading, error, data } = useQuery(query, {
    variables: { language: "english" },
  });

  let protocols = [{ name: "ALL" }];
  if (!loading) {
    for (let protocol of data.protocols) {
      protocols.push({
        name: protocol.name,
      });
    }
  }

  return (
    <div className="container ">
      <Menu className="container is-flex-wrap-wrap" secondary>
        {_.map(protocols, (protocol) => {
          return (
            <Menu.Item
              className=""
              name={protocol.name}
              active={activeItem === protocol.name}
              onClick={handleClick}
              key={protocol.name}
            />
          );
        })}
      </Menu>
    </div>
  );
};

export default ProtocolMenu;
