import { signal, computed } from "@preact/signals";
import type { MealForm } from "./types/global";
import type { ReadonlySignal } from "@preact/signals-core";
import type { IndexedDBWrapper } from "./utils/indexedDbWrapper";

const caloriesDaily = signal<number>(0)
const foodItems = signal<MealForm[]>([])
const DBInstance = signal<IndexedDBWrapper>()

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
  setCaloriesDaily: async (val: number) => {
    caloriesDaily.value = val
    
    await DBInstance.value?.update('settings', {
      id: 1, // fixed
      daily_calorie_count: val
    })
  },

  setDBInstance: (db: IndexedDBWrapper) => {
    DBInstance.value = db
  },

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
    foodItems,
    DBInstance
  },
  getters,
  actions
}
