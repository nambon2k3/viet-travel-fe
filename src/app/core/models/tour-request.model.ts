// Cấu trúc chung cho API response
export interface GeneralResponse<T> {
    code: number;
    message: string;
    data: T;
  }
  
  // Cấu trúc phân trang
  export interface PagingDTO<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
  }
  
  // Enum trạng thái tour
  export enum TourStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
  }
  
  // Enum loại tour
  export enum TourType {
    SIC = 'SIC',
    PRIVATE = 'PRIVATE',
    GROUP = 'GROUP',
  }
  
  // Enum trạng thái hiển thị trên giao diện
  export enum TourStatusDisplay {
    PENDING = 'Chờ duyệt',
    APPROVED = 'Đã phê duyệt',
    REJECTED = 'Đã từ chối',
    CANCELLED = 'Đã hủy',
    IN_PROGRESS = 'Đang diễn ra',
    COMPLETED = 'Hoàn thành',
  }
  
  // DTO cho danh sách tour cần xử lý (TourProcessDTO)
  export interface TourProcessDTO {
    id: number;
    name: string;
    tourType: TourType;
    createdAt: string;
    tourStatus: TourStatus;
  }
  
  // DTO cho chi tiết tour (TourProcessDetailDTO - giả định)
  export interface TourProcessDetailDTO {
    id: number;
    name: string;
    tourType: TourType;
    createdAt: string;
    updatedAt: string;
    tourStatus: TourStatus;
    startDate: string;
    endDate: string;
    dayNumber: number;
    reason: string;
    proposer: string;
    totalPrice: number;
    tourDays: TourDayProcessDetailDTO[];
  }
  
  // DTO cho chi tiết ngày tour (TourDayProcessDetailDTO - giả định)
  export interface TourDayProcessDetailDTO {
    id: number;
    dayNumber: number;
    description: string;
    activities: string[];
    totalPrice: number;
  }
  
  // Model frontend cho danh sách tour
  export interface Tour {
    id: number;
    name: string;
    tourType: TourType;
    createdAt: string;
    tourStatus: TourStatus;
  }
  
  // Model frontend cho chi tiết tour
  export interface TourDetail {
    id: number;
    name: string;
    tourType: TourType;
    createdAt: string;
    updatedAt: string;
    tourStatus: TourStatus;
    startDate: string;
    endDate: string;
    dayNumber: number;
    reason: string;
    proposer: string;
    totalPrice: number;
    tourDays: TourDayDetail[];
  }
  
  // Model frontend cho chi tiết ngày tour
  export interface TourDayDetail {
    id: number;
    dayNumber: number;
    description: string;
    activities: string[];
    totalPrice: number;
  }