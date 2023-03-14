import { Td, Tr } from "@chakra-ui/react";
import React from "react";

const TableElement = ({ objectKey, value }) => {
  return (
    <Tr>
      <Td paddingInline="5px" color="white"><b>{objectKey}</b></Td>
      <Td paddingInline="5px" textAlign="right" color="whiteAlpha.700">{value}</Td>
    </Tr>
  );
};

export default TableElement;
