export interface ServiceContact {
  id: number;
  position: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: string; 
  deleted: boolean;
  selected: boolean;
  serviceProvider: {
      id: number;
      name: string
  }[];
}
