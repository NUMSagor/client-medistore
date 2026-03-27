import { Product } from "./products";


export interface CartItem extends Product {
  quantity: number;
}
