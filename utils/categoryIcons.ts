import {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Receipt,
  Film,
  Heart,
  GraduationCap,
  MoreHorizontal,
  Wallet,
  PiggyBank,
  Home,
  Plane,
  Smartphone,
  Zap,
  Gift,
  Banknote,
  CreditCard,
  Building2,
  Briefcase,
  Gamepad2,
  Dumbbell,
  Coffee,
  Music,
  BookOpen,
  Fuel,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react-native";

// Category icon and color mapping
export interface CategoryConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const getCategoryConfig = (categoryName: string): CategoryConfig => {
  const name = categoryName.toUpperCase();
  
  // Food & Dining
  if (name.includes('FOOD') || name.includes('DINING') || name.includes('RESTAURANT') || name.includes('SWIGGY') || name.includes('ZOMATO')) {
    return { icon: UtensilsCrossed, color: '#FF6B6B', bgColor: 'rgba(255, 107, 107, 0.15)' };
  }
  // Coffee & Beverages
  if (name.includes('COFFEE') || name.includes('CAFE') || name.includes('BEVERAGE')) {
    return { icon: Coffee, color: '#8B4513', bgColor: 'rgba(139, 69, 19, 0.15)' };
  }
  // Shopping
  if (name.includes('SHOP') || name.includes('AMAZON') || name.includes('FLIPKART') || name.includes('MYNTRA') || name.includes('RETAIL')) {
    return { icon: ShoppingBag, color: '#4ECDC4', bgColor: 'rgba(78, 205, 196, 0.15)' };
  }
  // Transport & Travel
  if (name.includes('TRANSPORT') || name.includes('UBER') || name.includes('OLA') || name.includes('CAB') || name.includes('AUTO')) {
    return { icon: Car, color: '#45B7D1', bgColor: 'rgba(69, 183, 209, 0.15)' };
  }
  // Travel & Flights
  if (name.includes('TRAVEL') || name.includes('FLIGHT') || name.includes('HOTEL') || name.includes('VACATION')) {
    return { icon: Plane, color: '#9B59B6', bgColor: 'rgba(155, 89, 182, 0.15)' };
  }
  // Fuel & Petrol
  if (name.includes('FUEL') || name.includes('PETROL') || name.includes('DIESEL') || name.includes('GAS')) {
    return { icon: Fuel, color: '#E67E22', bgColor: 'rgba(230, 126, 34, 0.15)' };
  }
  // Bills & Utilities
  if (name.includes('BILL') || name.includes('UTILITY') || name.includes('ELECTRIC') || name.includes('WATER') || name.includes('RECHARGE')) {
    return { icon: Receipt, color: '#F39C12', bgColor: 'rgba(243, 156, 18, 0.15)' };
  }
  // Electricity & Power
  if (name.includes('POWER') || name.includes('ELECTRICITY')) {
    return { icon: Zap, color: '#F1C40F', bgColor: 'rgba(241, 196, 15, 0.15)' };
  }
  // Entertainment
  if (name.includes('ENTERTAIN') || name.includes('MOVIE') || name.includes('NETFLIX') || name.includes('STREAMING')) {
    return { icon: Film, color: '#E74C3C', bgColor: 'rgba(231, 76, 60, 0.15)' };
  }
  // Music & Subscriptions
  if (name.includes('MUSIC') || name.includes('SPOTIFY') || name.includes('SUBSCRIPTION')) {
    return { icon: Music, color: '#1DB954', bgColor: 'rgba(29, 185, 84, 0.15)' };
  }
  // Gaming
  if (name.includes('GAME') || name.includes('GAMING')) {
    return { icon: Gamepad2, color: '#8E44AD', bgColor: 'rgba(142, 68, 173, 0.15)' };
  }
  // Health & Medical
  if (name.includes('HEALTH') || name.includes('MEDICAL') || name.includes('HOSPITAL') || name.includes('PHARMACY') || name.includes('DOCTOR')) {
    return { icon: Heart, color: '#E91E63', bgColor: 'rgba(233, 30, 99, 0.15)' };
  }
  // Fitness & Gym
  if (name.includes('FITNESS') || name.includes('GYM') || name.includes('SPORTS')) {
    return { icon: Dumbbell, color: '#00BCD4', bgColor: 'rgba(0, 188, 212, 0.15)' };
  }
  // Education
  if (name.includes('EDUCATION') || name.includes('SCHOOL') || name.includes('COLLEGE') || name.includes('COURSE') || name.includes('LEARNING')) {
    return { icon: GraduationCap, color: '#3498DB', bgColor: 'rgba(52, 152, 219, 0.15)' };
  }
  // Books
  if (name.includes('BOOK')) {
    return { icon: BookOpen, color: '#795548', bgColor: 'rgba(121, 85, 72, 0.15)' };
  }
  // Salary & Income
  if (name.includes('SALARY') || name.includes('INCOME') || name.includes('EARNING')) {
    return { icon: Wallet, color: '#27AE60', bgColor: 'rgba(39, 174, 96, 0.15)' };
  }
  // Investment & Savings
  if (name.includes('INVEST') || name.includes('SAVING') || name.includes('MUTUAL') || name.includes('STOCK') || name.includes('SIP')) {
    return { icon: PiggyBank, color: '#FF9800', bgColor: 'rgba(255, 152, 0, 0.15)' };
  }
  // Home & Rent
  if (name.includes('HOME') || name.includes('RENT') || name.includes('HOUSING') || name.includes('MAINTENANCE')) {
    return { icon: Home, color: '#607D8B', bgColor: 'rgba(96, 125, 138, 0.15)' };
  }
  // Phone & Mobile
  if (name.includes('PHONE') || name.includes('MOBILE') || name.includes('TELECOM')) {
    return { icon: Smartphone, color: '#00ACC1', bgColor: 'rgba(0, 172, 193, 0.15)' };
  }
  // Gifts
  if (name.includes('GIFT')) {
    return { icon: Gift, color: '#E91E63', bgColor: 'rgba(233, 30, 99, 0.15)' };
  }
  // Cash & ATM
  if (name.includes('CASH') || name.includes('ATM') || name.includes('WITHDRAW')) {
    return { icon: Banknote, color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.15)' };
  }
  // Credit Card & EMI
  if (name.includes('CREDIT') || name.includes('EMI') || name.includes('LOAN')) {
    return { icon: CreditCard, color: '#673AB7', bgColor: 'rgba(103, 58, 183, 0.15)' };
  }
  // Bank & Transfer
  if (name.includes('BANK') || name.includes('TRANSFER') || name.includes('NEFT') || name.includes('IMPS') || name.includes('UPI')) {
    return { icon: Building2, color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.15)' };
  }
  // Business & Work
  if (name.includes('BUSINESS') || name.includes('OFFICE') || name.includes('WORK')) {
    return { icon: Briefcase, color: '#455A64', bgColor: 'rgba(69, 90, 100, 0.15)' };
  }
  // Insurance
  if (name.includes('INSURANCE')) {
    return { icon: ShieldCheck, color: '#009688', bgColor: 'rgba(0, 150, 136, 0.15)' };
  }
  
  // Default: OTHER
  return { icon: MoreHorizontal, color: '#9E9E9E', bgColor: 'rgba(158, 158, 158, 0.15)' };
};

