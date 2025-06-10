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
    <div className="bg-[#CDF0C1] min-h-screen p-6">
      <h1 className="text-center text-5xl font-display text-[#5C3A00] drop-shadow mb-6">
        Boston Coffee Shops
      </h1>

      <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Map */}
        <div className="flex-[3] rounded-xl overflow-hidden border border-gray-300 shadow">
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
        <div className="flex-[2] max-h-[300px] md:max-h-[400px] overflow-y-auto">
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
