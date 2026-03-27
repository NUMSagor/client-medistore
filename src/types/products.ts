
export interface Product {
  id: string;
  name: string;
  genericName?: string;
  manufacturer?: string;

  description?: string;
  price: number;
  discountPercent?: number;
  stock?: number;
  quantity?: number;

  imageUrl?: string;
  category: {
    name: string;
  };
}
