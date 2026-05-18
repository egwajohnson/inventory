export interface ShopifyOrder {
  id: number;
  email?: string;
  total_price?: string;
  customer?: {
    first_name?: string;
    last_name?: string;
  };
}
