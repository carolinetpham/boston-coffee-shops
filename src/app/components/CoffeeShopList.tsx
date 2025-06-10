// CoffeeShopList.tsx
import React from "react";
import { CoffeeShop } from "../types";

interface CoffeeShopListProps {
  shops: CoffeeShop[];
  onSelectShop: (shop: CoffeeShop) => void;
  userLocation: google.maps.LatLngLiteral;
}

const CoffeeShopList: React.FC<CoffeeShopListProps> = ({
  shops,
  onSelectShop,
  userLocation,
}) => {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const haversineDistance = (
    loc1: google.maps.LatLngLiteral,
    loc2: google.maps.LatLngLiteral
  ) => {
    const R = 6371;
    const dLat = toRad(loc2.lat - loc1.lat);
    const dLon = toRad(loc2.lng - loc1.lng);
    const lat1 = toRad(loc1.lat);
    const lat2 = toRad(loc2.lat);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const sortedShops = [...shops].sort(
    (a, b) =>
      haversineDistance(userLocation, a.location) -
      haversineDistance(userLocation, b.location)
  );

  return (
    <div className="bg-[#FEFDE4] p-3 h-full rounded-xl overflow-y-auto shadow-inner">
      <h2 className="font-bold text-xl text-[#5C3A00] mb-2 font-display text-center">
        Nearby Cafes
      </h2>
      <ul className="space-y-1.5">
        {sortedShops.map((shop, index) => (
          <li
            key={index}
            onClick={() => onSelectShop(shop)}
            className="cursor-pointer px-2.5 py-1.5 bg-white rounded-md hover:bg-[#CDF0C1] text-[#5C3A00] transition font-medium shadow-sm"
          >
            {shop.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoffeeShopList;
