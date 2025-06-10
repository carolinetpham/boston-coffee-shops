// CoffeeShopDetails.tsx
import React from "react";
import { CoffeeShop } from "../types";

interface Props {
  shop: CoffeeShop | null;
}

const CoffeeShopDetails: React.FC<Props> = ({ shop }) => {
  if (!shop) return <div className="p4">Select a shop to see details.</div>;

  return (
    <div className="p-4 border-t border-gray-300 mt-4">
      <h2 className="font-bold text-lg">{shop.name}</h2>
      <p>
        <strong>Address:</strong> {shop.address}
      </p>
      <p>
        <strong>Hours:</strong> {shop.hours}
      </p>
      <p>
        <strong>WiFi:</strong> {shop.wifi ? "Available" : "Not Available"}
      </p>
      <p>
        <strong>Seating:</strong> {shop.seating}
      </p>
    </div>
  );
};

export default CoffeeShopDetails;
