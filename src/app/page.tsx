import { MapProvider } from "./providers/map-providers";
import { MapComponent } from "./components/map-component";

export default function Home() {
  return (
    <MapProvider>
      <MapComponent />
    </MapProvider>
  );
}
