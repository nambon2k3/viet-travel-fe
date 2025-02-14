export interface User {
    id: number;
    fullName: string;
    username: string;
    email: string;
    gender: boolean;
    phone: string;
    address: string;
    role: [string];
    deleted: boolean;
    selected: boolean;
    createdAt: Date;
}