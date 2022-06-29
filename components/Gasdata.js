import moment from "moment";
import { useEffect, useState } from "react";

export default function Gasdata(props) {
  let valuereceivedmainnet = 0;
  let gasspentmainnet = 0;
  let valuereceivedpolygon = 0;
  let gasspentpolygon = 0;
  let valuereceivedoptimism = 0;
  let gasspentoptimism = 0;

  //   console.log("range", props.range);
  let isDateRangeSelected = props.range.includes(false) === false;
  let date1 = moment(props.range[0]);
  let date2 = moment(props.range[1]);

  props.mainnetdata.data.items.map((item, i) => {
    let isInDateRange = moment(item.block_signed_at).isBetween(
      moment(date1).format("YYYY-MM-DD"),
      moment(date2).format("YYYY-MM-DD")
    );

    if (item.from_address != props.address.toLowerCase()) {
      if (isDateRangeSelected && isInDateRange) {
        valuereceivedmainnet += item.value / 10 ** 18;
      }

      if (isDateRangeSelected === false) {
        valuereceivedmainnet += item.value / 10 ** 18;
      }
    }

    if (item.from_address == props.address.toLowerCase()) {
      if (isDateRangeSelected && isInDateRange) {
        gasspentmainnet += (item.fees_paid / 10 ** 18) * item.gas_quote_rate;
      }

      if (isDateRangeSelected === false) {
        gasspentmainnet += (item.fees_paid / 10 ** 18) * item.gas_quote_rate;
      }
    }
  });

  props.polygondata.data.items.map((item, i) => {
    let isInDateRange = moment(item.block_signed_at).isBetween(
      moment(date1).format("YYYY-MM-DD"),
      moment(date2).format("YYYY-MM-DD")
    );
    if (item.from_address != props.address.toLowerCase()) {
      if (isDateRangeSelected && isInDateRange) {
        valuereceivedpolygon += item.value / 10 ** 18;
      }

      if (isDateRangeSelected === false) {
        valuereceivedpolygon += item.value / 10 ** 18;
      }
    }

    if (item.from_address == props.address.toLowerCase()) {
      if (isDateRangeSelected && isInDateRange) {
        gasspentpolygon += (item.fees_paid / 10 ** 18) * item.gas_quote_rate;
      }

      if (isDateRangeSelected === false) {
        gasspentpolygon += (item.fees_paid / 10 ** 18) * item.gas_quote_rate;
      }
    }
  });

  props.optimismdata.data.items.map((item, i) => {
    let isInDateRange = moment(item.block_signed_at).isBetween(
      moment(date1).format("YYYY-MM-DD"),
      moment(date2).format("YYYY-MM-DD")
    );
    if (item.from_address != props.address.toLowerCase()) {
      if (isDateRangeSelected && isInDateRange) {
        valuereceivedoptimism += item.value / 10 ** 18;
      }

      if (isDateRangeSelected === false) {
        valuereceivedoptimism += item.value / 10 ** 18;
      }
    }

    if (item.from_address == props.address.toLowerCase()) {
      if (isDateRangeSelected && isInDateRange) {
        gasspentoptimism += (item.fees_paid / 10 ** 18) * item.gas_quote_rate;
      }

      if (isDateRangeSelected === false) {
        gasspentoptimism += (item.fees_paid / 10 ** 18) * item.gas_quote_rate;
      }
    }
  });

  return (
    <>
      <div>
        <div style={{ border: "2px solid black" }}>
          <h2>Mainnet</h2>
          <h3>Receipts from EOAs: {Number(valuereceivedmainnet)} ETH</h3>
          <h3>Gas Fees paid till Date: ${Number(gasspentmainnet)}</h3>
        </div>

        <div style={{ border: "2px solid black" }}>
          <h2>Polygon</h2>
          <h3>Receipts from EOAs: {Number(valuereceivedpolygon)} ETH</h3>
          <h3>Gas Fees paid till Date: ${Number(gasspentpolygon)}</h3>
        </div>
        <div style={{ border: "2px solid black" }}>
          <h2>Optimism</h2>
          <h3>Receipts from EOAs: {Number(valuereceivedoptimism)} ETH</h3>
          <h3>Gas Fees paid till Date: ${Number(gasspentoptimism)}</h3>
        </div>
      </div>
    </>
  );
}
