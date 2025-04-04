"use client";
import { useEffect, useState } from "react";
import { GoogleMap, MarkerF, InfoWindowF } from "@react-google-maps/api";

interface CoffeeShop {
  name: string;
  location: google.maps.LatLngLiteral;
}

export function MapComponent() {
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [shops, setShops] = useState<CoffeeShop[]>([]);
  const [selectedShop, setSelectedShop] = useState<CoffeeShop | null>(null);

  useEffect(() => {
    if (!window.google || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(currentLocation);

        const map = new google.maps.Map(document.createElement("div"));
        const service = new google.maps.places.PlacesService(map);

        const keywords = ["coffee", "cafe", "caffe", "caffè, cafè"];
        const uniqueResults = new Map<string, CoffeeShop>();
        let completedCalls = 0;

        keywords.forEach((keyword) => {
          service.nearbySearch(
            {
              location: currentLocation,
              radius: 3000,
              keyword,
              type: "cafe",
            },
            (results, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                results
              ) {
                results.forEach((place) => {
                  if (!uniqueResults.has(place.place_id!)) {
                    uniqueResults.set(place.place_id!, {
                      name: place.name!,
                      location: {
                        lat: place.geometry?.location?.lat() ?? 0,
                        lng: place.geometry?.location?.lng() ?? 0,
                      },
                    });
                  }
                });
              }

              completedCalls++;
              if (completedCalls === keywords.length) {
                setShops(Array.from(uniqueResults.values()));
              }
            }
          );
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflowY: "auto",
        backgroundColor: "#fff",
      }}
    >
      {/* Map Section */}
      <div style={{ height: "400px", width: "100%" }}>
        {userLocation && (
          <GoogleMap
            center={userLocation}
            zoom={14}
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            {/* User Location */}
            <MarkerF
              position={userLocation}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />

            {/* Cafes */}
            {shops.map((shop, i) => (
              <MarkerF
                key={i}
                position={shop.location}
                title={shop.name}
                onClick={() => setSelectedShop(shop)}
              />
            ))}

            {selectedShop && (
              <InfoWindowF
                position={selectedShop.location}
                onCloseClick={() => setSelectedShop(null)}
              >
                <div>
                  <h3 style={{ margin: 0 }}>{selectedShop.name}</h3>
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>
        )}
      </div>

      {/* List Section */}
      <div className="p-4 bg-white">
        <h2 className="text-xl font-bold text-black mb-2">Nearby Cafes</h2>
        <ul className="space-y-2">
          {shops.length === 0 ? (
            <li className="text-black">Still loading...</li>
          ) : (
            shops.map((shop, i) => (
              <li
                key={i}
                className="p-3 rounded shadow cursor-pointer"
                onClick={() => setSelectedShop(shop)}
              >
                {shop.name}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
