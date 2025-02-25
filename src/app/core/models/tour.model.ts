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
