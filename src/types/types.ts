export interface navItemType {
  name: string;
  href: string;
  for: string;
}

export interface User {
  id: number;
  name?: string;
  email: string;
  dob?: string;
  gender?: string;
  birthPlace?: string;
  birthTime?: string;
  role: "USER" | "ASTROLOGER" | "ADMIN";
  astrologer?: Astrologer
}


export interface Astrologer {
  id: number;
  bio?: string;
  expertise?: string;
  experience?: number;
  price?: number;
  isApproved: boolean;
  user: User;
  // image?: string
}

export interface Slot {
  id: string;
  astrologerId: number;
  date: string;
  startTime: string;
  endTime: string;
  isBlocked: boolean;
};

export interface Appointment {
  id: number;
  astrologerId: number
  endTime: string 
  startTime: string
  astrologer: Astrologer
  userId: number
  status: string
  date: string
}