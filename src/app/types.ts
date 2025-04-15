export interface CoffeeShop {
    name: string;
    location: google.maps.LatLngLiteral;
    address: string;
    hours: string;
    wifi: boolean;
    seating: string;
}


export interface MapComponentProps {
    shops: CoffeeShop[];
    setShops: (shops: CoffeeShop[]) => void;
    selectedShop: CoffeeShop | null;
    setSelectedShop: (shop: CoffeeShop | null) => void;
}