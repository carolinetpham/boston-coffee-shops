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
  // Helper function to convert degrees to radians
  const toRad = (value: number) => (value * Math.PI) / 180;

  // Haversine formula to calculate the great-circle distance between two points
  const haversineDistance = (
    loc1: google.maps.LatLngLiteral,
    loc2: google.maps.LatLngLiteral
  ) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(loc2.lat - loc1.lat);
    const dLon = toRad(loc2.lng - loc1.lng);
    const lat1 = toRad(loc1.lat);
    const lat2 = toRad(loc2.lat);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Create a sorted copy of shops by calculating distance from the user location
  const sortedShops = [...shops].sort(
    (a, b) =>
      haversineDistance(userLocation, a.location) -
      haversineDistance(userLocation, b.location)
  );

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Nearby Cafes</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {sortedShops.map((shop, index) => (
          <li
            key={index}
            onClick={() => onSelectShop(shop)}
            style={{ cursor: "pointer", marginBottom: "0.5rem" }}
          >
            {shop.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoffeeShopList;
