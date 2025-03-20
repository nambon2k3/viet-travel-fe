import { GeoPosition } from "./homepage.model";

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
  }
  
  export interface Pagination {
    page: number;
    size: number;
    total: number;
  }
  
  export interface Tag {
    id: number;
    name: string;
  }
  
  export interface Locations {
    id: number;
    name: string;
    description: string;
    image: string;
    geoPosition: GeoPosition;
  }
  
  export interface TourImage {
    id: number;
    imageUrl: string;
  }
  
  export interface Tour {
    id: number;
    name: string;
    numberDays: number;
    numberNight: number;
    tags: Tag[];
    departLocation: Locations;
    tourImages: TourImage[];
    priceFrom: number;
  }
  
  export interface Items {
    page: number;
    size: number;
    total: number;
    items: Tour[];
  }

  
  export interface TourListResponse {
    locations : Locations[];
    tours: Items;
  }
  