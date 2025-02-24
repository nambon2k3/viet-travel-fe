export interface ServiceProvider {
  id: number;
  imageUrl: string;
  name: string;
  abbreviation: string;
  website: string;
  email: string;
  phone: string; 
  address: string;
  deleted: boolean;
  selected: boolean;
  location: {
      id: number;
      name: string;
  };
  geoPosition: {
      id: number;
      latitude: number;
      longitude: number;
  };
  user: {
      id: number;
      fullName: string;
      email: string;
  };
  serviceCategories: {
      id: number;
      name: string;
  }[];
}
