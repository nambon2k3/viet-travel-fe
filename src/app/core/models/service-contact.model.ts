export interface ServiceContact {
    id: number;
    position: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    gender: 'MALE' | 'FEMALE'; 
    deleted: boolean;
    selected: boolean;
    serviceProviderName: string;
  }