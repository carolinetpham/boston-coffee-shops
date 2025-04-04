"use client";

import { GoogleMap, Libraries, useJsApiLoader } from "@react-google-maps/api";
import { ReactNode, useCallback, useState } from "react";

const libraries: Libraries = ["places", "drawing", "geometry"];

const mapContainerStyle = {
  width: "100%",
  height: "400px", 
};

const defaultCenter = {
  lat: 42.3555,
  lng: -71.0565,
};

export function MapProvider({ children }: { children: ReactNode }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  if (loadError) return <p>Error loading Google Maps</p>;
  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={12}
      onLoad={onLoad}
      mapTypeId="roadmap" 
    >
      {children}
    </GoogleMap>
  );
}
