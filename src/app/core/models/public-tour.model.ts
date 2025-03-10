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
  
  export interface Location {
    id: number;
    name: string;
    description: string;
    image: string;
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
    departlocation: Location;
    tourImages: TourImage[];
    priceFrom: number;
  }
  
  export interface TourListResponse {
    page: number;
    size: number;
    total: number;
    items: Tour[];
  }
  