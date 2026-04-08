export type EarningsType = 'order' | 'bonus' | 'withdrawal';
export type EarningsStatus = 'pending' | 'completed' | 'failed';

export interface Earnings {
  id: number;
  user_id: number;
  order_id: number;
  amount: number;
  type: EarningsType;
  status: EarningsStatus;
  created_at: Date;
}

export interface EarningsCreate {
  user_id: number;
  order_id: number;
  amount: number;
  type?: EarningsType;
  status?: EarningsStatus;
}

export interface EarningsSummary {
  today: number;
  week: number;
  month: number;
  total: number;
}

export interface EarningsWithOrder extends Earnings {
  order_number: string;
  restaurant_name: string;
}