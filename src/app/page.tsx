"use client";
import { MapProvider } from "./providers/MapProvider";
import { MapComponent } from "./components/MapComponent";
import CoffeeShopList from "./components/CoffeeShopList";
import { useState } from "react";

export default function Home() {
  interface CoffeeShop {
    name: string;
    location: google.maps.LatLngLiteral;
  }

  const [selectedShop, setSelectedShop] = useState<CoffeeShop | null>(null);
  const [shops, setShops] = useState<CoffeeShop[]>([]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Boston Coffee Shops
      </h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <MapProvider>
            <MapComponent
              shops={shops}
              setShops={setShops}
              selectedShop={selectedShop}
              setSelectedShop={setSelectedShop}
            />
          </MapProvider>
        </div>
        <div className="w-full md:w-1/3">
          <CoffeeShopList shops={shops} onSelectShop={setSelectedShop} />
        </div>
      </div>
    </div>
  );
}
