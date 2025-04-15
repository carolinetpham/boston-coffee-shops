"use client";
import { MapProvider } from "./providers/MapProvider";
import { MapComponent } from "./components/MapComponent";
import CoffeeShopList from "./components/CoffeeShopList";
import { useEffect, useState } from "react";
import CoffeeShopDetails from "./components/CoffeeShopDetails";
import { CoffeeShop } from "./types";

export default function Home() {
  const [selectedShop, setSelectedShop] = useState<CoffeeShop | null>(null);
  const [shops, setShops] = useState<CoffeeShop[]>([]);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Boston Coffee Shops
      </h1>

      {/* Map + List Side-by-Side */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Map */}
        <div className="w-full md:w-2/3">
          <MapProvider>
            <MapComponent
              shops={shops}
              setShops={setShops}
              selectedShop={selectedShop}
              setSelectedShop={setSelectedShop}
            />
          </MapProvider>
        </div>

        {/* Cafe List */}
        <div className="w-full md:w-1/3 md:h-[400px] md:sticky md:top-24 overflow-y-auto">
          {userLocation && (
            <CoffeeShopList
              shops={shops}
              onSelectShop={setSelectedShop}
              userLocation={userLocation}
            />
          )}
        </div>
      </div>

      {/* Shop Details Below */}
      <div className="w-full mt-6">
        <CoffeeShopDetails shop={selectedShop} />
      </div>
    </div>
  );
}
