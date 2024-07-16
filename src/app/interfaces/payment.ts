// interfaces/payment.ts
export interface Payment {
    id: number;
    person_id: number;
    pay_day: string;
    activity: {
      id: number;
      names: string;
      budget: number;
      destination_date: string;
    };
    detail_payment_id: number;
  }
  