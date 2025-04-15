// CoffeeShopDetails.tsx
import React from "react";
import { CoffeeShop } from "../types";

interface Props {
  shop: CoffeeShop | null;
}

const CoffeeShopDetails: React.FC<Props> = ({ shop }) => {
  if (!shop) return <div style={{ padding: "1rem" }}>Select a shop to see details.</div>;

  return (
    <div style={{ padding: "1rem", borderTop: "1px solid #ccc", marginTop: "1rem" }}>
      <h2>{shop.name}</h2>
      <p><strong>Address:</strong> {shop.address}</p>
      <p><strong>Hours:</strong> {shop.hours}</p>
      <p><strong>WiFi:</strong> {shop.wifi ? "Available" : "Not Available"}</p>
      <p><strong>Seating:</strong> {shop.seating}</p>
    </div>
  );
};

export default CoffeeShopDetails;