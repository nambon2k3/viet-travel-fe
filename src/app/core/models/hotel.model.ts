export interface ApiResponse<T> {
    code: number;
    message: string;
    data: PaginatedData<T>;
  }
  
  export interface PaginatedData<T> {
    page: number;
    size: number;
    total: number;
    items: T[];
  }
  
  export interface Hotel {
    id: number;
    imageUrl: string;
    name: string;
    abbreviation: string;
    website: string;
    email: string;
    star: number;
    phone: string;
    address: string;
    location: LocationData;
    geoPosition: GeoPosition;
  }
  
  export interface LocationData {
    id: number;
    name: string;
    description: string;
    image: string;
  }
  
  export interface GeoPosition {
    id: number;
    latitude: number;
    longitude: number;
  }
  