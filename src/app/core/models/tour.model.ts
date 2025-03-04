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
  tourName: string;
  authorName: string;
  duration: number;
  slot: number;
  price: number;
  status: string;
  deleted: boolean;
}
