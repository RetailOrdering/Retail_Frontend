import { User } from "./user";

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  user: User;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
}

export interface AddToCartDto {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CreateOrderDto {
  address: string;
  paymentMethod: string;
  couponCode?: string;
}

export interface UpdateOrderStatusDto {
  status: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  packaging: string;
  brand: string;
  categoryId: number;
  stock: number;
  isAvailable?: boolean;  // optional, backend defaults to true
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  isAvailable?: boolean;
}

export interface CreateCouponDto {
  code: string;
  discountPercentage: number;
  expiryDate: Date;
  minimumOrderAmount: number;
}

export interface UpdateRoleRequest {
  role: string;
}

export interface RedeemPointsRequest {
  points: number;
}