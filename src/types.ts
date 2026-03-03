export interface Service {
  id: string | number;
  name: string;
  ratePer1000: number;
  min: number;
  max: number;
  description: string[];
  category: string;
}

export interface Category {
  id: string;
  name: string;
  services: Service[];
}
