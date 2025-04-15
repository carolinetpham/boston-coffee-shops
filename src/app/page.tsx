"use client";
import { MapProvider } from "./providers/MapProvider";
import { MapComponent } from "./components/MapComponent";
import CoffeeShopList from "./components/CoffeeShopList";
import { useEffect, useState } from "react";

export default function Home() {
  interface CoffeeShop {
    name: string;
    location: google.maps.LatLngLiteral;
  }

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
          {userLocation && (
            <CoffeeShopList
              shops={shops}
              onSelectShop={setSelectedShop}
              userLocation={userLocation}
            />
          )}
        </div>
      </div>
    </div>
  );
}
