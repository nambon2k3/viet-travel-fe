export interface Tour {
  id: number;
  name: string;
  highlights: string;
  numberSeats: number;
  numberDays: number;
  numberNight: number;
  note?: string;
  locationsId?: number[];
  tagsId?: number[];
  departLocationId?: number;
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

export interface Tag {
  id: number;
  name: string;
}

export interface Activity {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  pricePerPerson: number;
  geoPosition: GeoPosition;
  locationId: number;
  activityCategoryId: number;
  deleted: boolean;
}

export interface GeoPosition {
  id: number;
  latitude: number;
  longitude: number;
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
  }
}
