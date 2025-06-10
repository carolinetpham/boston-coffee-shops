// CoffeeShopDetails.tsx
import React from "react";
import { CoffeeShop } from "../types";

interface Props {
  shop: CoffeeShop | null;
}

const CoffeeShopDetails: React.FC<Props> = ({ shop }) => {
  if (!shop) {
    return (
      <div className="p-3 bg-[#FEFDE4] rounded-xl border border-gray-300 text-[#5C3A00] shadow-inner text-sm">
        Select a shop to see details.
      </div>
    );
  }

  return (
    <div className="bg-[#FEFDE4] rounded-xl border border-gray-200 p-4 shadow-inner text-[#5C3A00] text-sm space-y-2">
      <h2 className="font-bold text-lg mb-1">{shop.name}</h2>
      <p>
        <span className="font-semibold">Address:</span> {shop.address}
      </p>
      <p>
        <span className="font-semibold">Hours:</span> {shop.hours}
      </p>
      <p>
        <span className="font-semibold">WiFi:</span>{" "}
        {shop.wifi ? "Available" : "Not Available"}
      </p>
      <p>
        <span className="font-semibold">Seating:</span> {shop.seating}
      </p>
    </div>
  );
};

export default CoffeeShopDetails;
