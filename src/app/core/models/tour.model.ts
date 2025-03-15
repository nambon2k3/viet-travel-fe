import { User } from "./user.model";

export interface Tour {
  id: number;
  tourName: string;
  startDate: string;
  slot: number;
  Operator: User;
  status: string;
  TourGuide: User;
}

export interface TourHOB {
  id: number;
  name: string;
  highlights: string;
  numberDays: number;
  numberNight: number;
  note: string;
  deleted: boolean;
  tourType: string;
  markUpPercent: number;
  privacy: string;
  createdUserId: number;
  createdUserName: string;
}

export interface TourDetailHOB {
  id: number;
  name: string;
  highlights: string;
  numberDays: number;
  numberNight: number;
  note: string;
  privacy: string;
  createdUserId: number;
  createdUserName: string;
  locations: {
    id: number;
    name: string;
    description: string;
    image: string;
  }[];
  tags: {
    id: number;
    name: string;
  }[];
  departLocation: {
    id: number;
    name: string;
    description: string;
    image: string;
  };
  tourSchedules: {
    scheduleId: number;
    startDate: string;
    endDate: string;
    sellingPrice: number;
    minPax: number;
    maxPax: number;
    availableSeats: number;
    meetingLocation: string;
    departureTime: {
      hour: number;
      minute: number;
      second: number;
      nano: number;
    };
    extraHotelCost: number;
  }[];
  tourImages: {
    id: number;
    imageUrl: string;
  }[];
  tourDays: {
    id: number;
    title: string;
    content: string;
    mealPlan: string;
  }[];
}

export interface TourDay {
  id: number;
  title: string;
  content: string;
  mealPlan: string;
  tourId: number;
  location: {
    id: number;
    name: string;
    description: string;
    image: string;
    deleted: boolean;
    geoPosition: {
      id: number;
      latitude: number;
      longitude: number;
    };
    createdAt: string;
  };
  tourDayServices: {
    id: number;
    serviceId: number;
    serviceName: string;
    quantity: number;
    sellingPrice: number;
  }[];
  createdAt: string;
  updatedAt: string;
}