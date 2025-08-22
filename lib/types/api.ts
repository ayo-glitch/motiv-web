// Shared types between frontend and backend
export interface User {
  ID: string;
  Name: string;
  Username: string;
  Email: string;
  Avatar?: string;
  Role: 'guest' | 'host' | 'admin' | 'superhost';
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;
  // Legacy lowercase fields for backward compatibility
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  avatar?: string;
  role?: 'guest' | 'host' | 'admin' | 'superhost';
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  start_time: string;
  end_time: string;
  location: string;
  tags: string[];
  banner_image_url: string;
  event_type: 'free' | 'ticketed';
  host_id: string;
  host: User;
  status: 'draft' | 'active' | 'cancelled' | 'completed';
  attendee_count?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TicketType {
  id: string;
  eventID: string;
  name: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  eventID: string;
  event: Event;
  userID: string;
  user: User;
  ticketTypeID: string;
  ticketType: TicketType;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  userID: string;
  eventID: string;
  user: User;
  event: Event;
  createdAt: string;
  updatedAt: string;
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'guest' | 'host' | 'admin' | 'superhost';
}

export interface GoogleAuthRequest {
  credential: string;
  user: GoogleUser;
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endTime: string;
  location: string;
  tags: string;
  bannerImageURL: string;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  status?: 'draft' | 'active' | 'cancelled' | 'completed';
}

export interface PurchaseTicketRequest {
  eventID: string;
  ticketTypeID: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}