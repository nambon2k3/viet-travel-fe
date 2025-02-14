export interface User {
    id: number;
    fullName: string;
    username: string;
    password: string;
    email: string;
    gender: boolean;
    phone: string;
    address: string;
    roleNames: [string];
    deleted: boolean;
    selected: boolean;
    createdAt: Date;
}