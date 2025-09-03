import { signal, computed } from "@preact/signals";
import type { MealForm } from "./types/global";
import type { ReadonlySignal } from "@preact/signals-core";

const caloriesDaily = signal<number>(2500)
const foodItems = signal<MealForm[]>([])

const getters: {
  getfoodItems: ReadonlySignal<MealForm[]>
  consumedCalories: ReadonlySignal<number>
  remainingCalories: ReadonlySignal<number>
} = {
  getfoodItems:  computed(() => {
    return foodItems.value.reverse();
  }),
  consumedCalories: computed(() => {
    return foodItems.value.reduce((total, item) => total+= item.calories, 0);
  }),
  remainingCalories: computed(() => {
    let result = caloriesDaily.value - getters.consumedCalories.value
    return result
  })
}

const actions = {
  storeFoodItems: (items: MealForm[]) => {
    foodItems.value = [...items];
  },

  addFoodItem: (item: MealForm) => {
    foodItems.value = [ ...foodItems.value, item ]
  },

  deleteFoodItems: (ids: string[]) => {
    foodItems.value = foodItems.value.filter((item) => {
      return !ids.includes(item.id)
    })
  },

  clearFoodItems: () => {
    foodItems.value = []
  }
}

export const store = {
  state: {
    caloriesDaily,
    foodItems
  },
  getters,
  actions
}
