export interface Message {
  id: string;
  sender: {
    id: string;
    username: string;
  };
  roomId: string;
  content: string;
  createdAt: string; // API trả về chuỗi ISO date
}
