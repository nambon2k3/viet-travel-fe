import { User } from "./user.model";

export interface loadRequests {
    id: number;
    tourName: string;
    bookingId: number;
    note: string;
    createdAt: string;
    deleted: boolean;
    status: string;
    type: string;
}