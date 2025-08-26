import { useState } from 'preact/hooks'
import './app.css'

export function App() {
  const [dailyCalories, setDailyCalories] = useState(1650)
  const foods = {
    breakfast: [
      { title: "2 pcs Pandesal", description: "Soft Filipino bread rolls", calories: 300 },
      { title: "1 cup Oatmeal with Banana", description: "Rolled oats with sliced banana", calories: 250 },
      { title: "2 Boiled Eggs", description: "Hard-boiled chicken eggs", calories: 160 },
      { title: "1 cup Fried Rice", description: "Garlic fried rice", calories: 320 },
      { title: "1 cup Coffee with Milk", description: "Nescafe with evaporated milk", calories: 90 }
    ],
    lunch: [
      { title: "1 cup White Rice", description: "Steamed white rice", calories: 200 },
      { title: "150g Grilled Chicken Breast", description: "Skinless chicken breast, grilled", calories: 280 },
      { title: "1 cup Adobong Sitaw", description: "String beans cooked in soy sauce and vinegar", calories: 180 },
      { title: "1 cup Tinola", description: "Chicken soup with green papaya and malunggay", calories: 220 },
      { title: "1 pc Fried Tilapia", description: "Pan-fried tilapia fish", calories: 350 }
    ],
    dinner: [
      { title: "1 cup Brown Rice", description: "Steamed brown rice", calories: 215 },
      { title: "100g Roasted Pork", description: "Oven-roasted pork belly", calories: 350 },
      { title: "1 cup Pinakbet", description: "Mixed vegetables with bagoong", calories: 200 },
      { title: "1 bowl Sinigang na Baboy", description: "Pork soup with tamarind broth and vegetables", calories: 400 },
      { title: "1 Banana", description: "Medium ripe banana", calories: 105 }
    ]
  }

  const caloriesData = [
    { type: "consumed", calories: 100 },
    { type: "remaining", calories: 1400 },
  ]

  const caloriesPerCategory = (list:any[]) => {
    const total = list.reduce((sum, l) => {
      return sum += l.calories
    }, 0)

    return total
  }

  return (
    <>
      <div class="flex justify-center bg-gray-200">
        <div class="w-[700px] h-screen bg-white p-2">
          <div class="grid grid-cols-2 gap-2">
            {caloriesData.map((x) => (
              <div class="p-1 bg-gray-200 capitalize text-center">
                <p class="text-2xl font-semibold">{ x.calories }</p>
                <p>{ x.type }</p>
              </div>
            ))}
          </div>

          <div class="mt-2 py-2 w-full bg-gray-300">
            <div class="text-center">Today</div>
            <p></p>
          </div>

          <div class="w-full mt-2">
          {Object.entries(foods).map(([mealType, mealList]) => (
              <div>
                <div class="bg-gray-200 p-2 uppercase flex justify-between">
                  <p>{ mealType }</p>
                  <p>{ caloriesPerCategory(mealList) }</p>
                </div>
                <div class="ml-2">
                  {mealList.map((meal) => (
                    <div class="flex justify-between items-center border-b-1 border-b-gray-200">
                      <div class="px-2">
                        <p>{ meal.title }</p>
                        <p class="text-sm">{ meal.description }</p>
                      </div>
                      <p class="p-1 font-semibold">{ meal.calories}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
