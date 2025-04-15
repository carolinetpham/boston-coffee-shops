"use client";
import { useEffect, useState } from "react";
import { GoogleMap, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { CoffeeShop, MapComponentProps } from "../types";

function hasWifi(reviews: google.maps.places.PlaceReview[] = []): boolean {
  const wifiKeywords = [
    "wifi",
    "wi-fi",
    "internet",
    "fast connection",
    "connection",
  ];
  return reviews.some((review) =>
    wifiKeywords.some((kw) =>
      review.text.toLowerCase().includes(kw.toLowerCase())
    )
  );
}

function hasSeating(reviews: google.maps.places.PlaceReview[] = []): boolean {
  const seatingKeywords = ["seating", "plugs", "tables", "roomy", "spacious"];
  return reviews.some((review) =>
    seatingKeywords.some((kw) =>
      review.text.toLowerCase().includes(kw.toLowerCase())
    )
  );
}

function formatGroupedHours(weekdayText: string[]): string {
  const parsed = weekdayText.map((line) => {
    const [dayStr, hours] = line.split(": ");
    const shortDay = dayStr.slice(0, 3);
    return [shortDay, hours] as [string, string];
  });

  const grouped: string[] = [];
  let startDay = parsed[0][0];
  let endDay = parsed[0][0];
  let currentHours = parsed[0][1];

  for (let i = 1; i < parsed.length; i++) {
    const [day, hours] = parsed[i];
    if (hours === currentHours) {
      endDay = day;
    } else {
      grouped.push(
        startDay === endDay
          ? `${startDay} ${currentHours}`
          : `${startDay}–${endDay} ${currentHours}`
      );
      startDay = endDay = day;
      currentHours = hours;
    }
  }

  grouped.push(
    startDay === endDay
      ? `${startDay} ${currentHours}`
      : `${startDay}–${endDay} ${currentHours}`
  );

  return grouped.join(", ");
}

export function MapComponent({
  shops,
  setShops,
  selectedShop,
  setSelectedShop,
}: MapComponentProps) {
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);

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

        const keywords = [
          "coffee",
          "cafe",
          "caffe",
          "caffè",
          "cafè,",
          "espresso",
          "bakery",
          "tatte",
        ];
        const uniqueResults = new Map<string, CoffeeShop>();

        let completedDetailCalls = 0;
        let totalDetailCalls = 0;

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
                const newPlaces = results.filter(
                  (place) => !uniqueResults.has(place.place_id!)
                );

                totalDetailCalls += newPlaces.length;

                newPlaces.forEach((place) => {
                  service.getDetails(
                    {
                      placeId: place.place_id!,
                      fields: [
                        "name",
                        "formatted_address",
                        "opening_hours",
                        "geometry",
                        "place_id",
                        "reviews",
                      ],
                    },
                    (details, detailsStatus) => {
                      if (
                        detailsStatus ===
                          google.maps.places.PlacesServiceStatus.OK &&
                        details
                      ) {
                        const shop: CoffeeShop = {
                          name: details.name || "Unknown",
                          location: {
                            lat: details.geometry?.location?.lat() ?? 0,
                            lng: details.geometry?.location?.lng() ?? 0,
                          },
                          address:
                            details.formatted_address || "No address available",
                          hours: details.opening_hours?.weekday_text
                            ? formatGroupedHours(
                                details.opening_hours.weekday_text
                              )
                            : "No hours available",
                          wifi: hasWifi(details.reviews),
                          seating: hasSeating(details.reviews)
                            ? "ample"
                            : "limited",
                        };

                        uniqueResults.set(details.place_id!, shop);
                      }

                      completedDetailCalls++;

                      if (completedDetailCalls === totalDetailCalls) {
                        setShops(Array.from(uniqueResults.values()));
                      }
                    }
                  );
                });
              }
            }
          );
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  }, [setShops]);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-[400px]">
        {userLocation && (
          <GoogleMap
            center={userLocation}
            zoom={14}
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            <MarkerF
              position={userLocation}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />

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
                  <h3 className="font-semibold">{selectedShop.name}</h3>
                  <p>{selectedShop.address}</p>
                  <p>{selectedShop.hours}</p>
                </div>
              </InfoWindowF>
            )}
          </GoogleMap>
        )}
      </div>

      {/* Shop details section below the map */}
      <div className="text-center text-gray-700">
        <p className="text-lg">Select a shop to see details.</p>
      </div>
    </div>
  );
}
