export interface Message {
  id: string;
  senderId: string;
  roomId: string;
  content: string;
  createdAt: string; // API trả về chuỗi ISO date
}
