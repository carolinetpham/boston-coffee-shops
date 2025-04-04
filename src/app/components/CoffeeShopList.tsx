// CoffeeShopList.tsx
import React from "react";

interface CoffeeShop {
  name: string;
  location: google.maps.LatLngLiteral;
}

interface CoffeeShopListProps {
  shops: CoffeeShop[];
  onSelectShop: (shop: CoffeeShop) => void;
}

const CoffeeShopList: React.FC<CoffeeShopListProps> = ({
  shops,
  onSelectShop,
}) => {
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Nearby Cafes</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {shops.map((shop, index) => (
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
