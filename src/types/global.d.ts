import { MEAL_TYPE_BREAKFAST, MEAL_TYPE_LUNCH, MEAL_TYPE_DINNER } from '@/config'

declare global {
  interface MealForm {
    id?: string;
    title: string;
    description: string;
    calories: number;
    type?: MEAL_TYPE_BREAKFAST | MEAL_TYPE_LUNCH | MEAL_TYPE_DINNER
  }
  
}