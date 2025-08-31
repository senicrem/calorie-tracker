export {};

declare global {
  interface MealForm {
    id?: string;
    title: string;
    description: string;
    calories: number;
  }
  
}