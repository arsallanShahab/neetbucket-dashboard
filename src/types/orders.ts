export interface ISoftCopyOrder {
  currency: string;
  order_id: string;
  items: IMongoDBChapter[]; // Optional array of strings (can be null)
  receipt?: string; // Optional string (can be null)
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  billing_details: {
    address: string;
    city: string;
    state: string;
  };
  total_quantity: number;
  total_amount: number;
  order_type: "softcopy" | "hardcopy";
  payment_status: string;
  created_at: Date | string;
}

export interface IMongoDBChapter {
  contentfulId: string;
  title: string;
  subject: string;
  class: string;
  price: number;
  thumbnail: {
    url: string;
    fileName: string;
    size: number;
  };
  fullPdf: {
    url: string;
    fileName: string;
    size: number;
  };
}

export interface IHardCopyOrder {
  currency: string;
  order_id: string;
  items: {
    id: string;
    title: string;
    thumbnail: {
      url: string;
      fileName: string;
      size: number;
    };
    quantity: number;
    price: number;
  }[];
  receipt?: string; // Optional string (can be null)
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  billing_details: {
    address: string;
    city: string;
    state: string;
  };
  shipping_details: {
    address: string;
    city: string;
    state: string;
  };
  delivery: {
    date: Date | string | null;
    status: "pending" | "packed" | "dispatched" | "delivered" | "cancelled";
    courier: string | null;
    tracking_id: string | null;
  };
  total_quantity: number;
  total_amount: number;
  order_type: "softcopy" | "hardcopy";
  payment_status: string;
  created_at: Date | string;
}
