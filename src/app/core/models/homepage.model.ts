export interface Tour {
  id: number;
  name: string;
  highlights: string;
  numberSeats: number;
  numberDays: number;
  numberNight: number;
  note?: string | null;
  locations: Location[];
  tags: Tag[];
  depart_location: Location;
  tickets: Ticket[];
  priceFrom: number;
  tourImages: TourImage[];
}

export interface Location {
  id: number;
  name: string;
  description: string;
  image: string;
  deleted: boolean;
  geoPosition: GeoPosition;
}

export interface GeoPosition {
  id: number;
  latitude: number;
  longitude: number;
  deleted: boolean;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Ticket {
  id: number;
  type: string;
  price: number;
  deleted: boolean;
}

export interface TourSchedule {
  id: number;
  date: string;
  deleted: boolean;
}

export interface TourImage {
  id: number;
  imageUrl: string;
  deleted: boolean;
}

export interface Blog {
  id: number;
  thumbnailImageUrl: string;
  title: string;
  description: string;
  content: string;
  author: Author;
  tags: Tag[];
  deleted: boolean;
  createdAt: string;
}

export interface Author {
  id: number;
  fullName: string;
  avatarImage: string;
  email: string;
}

export interface Activity {
  id: number;
  title: string;
  content: string | null;
  imageUrl: string;
  pricePerPerson: number;
  geoPosition: GeoPosition;
  locationId: number | null;
  activityCategoryId: number | null;
  deleted: boolean;
}

export interface ApiResponse {
  code: number;
  message: string;
  data: {
    topTourOfYear: Tour;
    trendingTours: Tour[];
    newBlogs: Blog[];
    recommendedActivities: Activity[];
    recommendedLocations: Location[];
  };
}