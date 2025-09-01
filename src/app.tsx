import './app.css'
import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import type { FormEvent } from 'preact/compat'
import meallist from "./data/meallist.json"

export function App() {
  const MY_DAILY_CALORIES = 1_500
  const [caloriesRemaining, setCaloriesRemaining] = useState(0)
  const [caloriesConsumed, setCaloriesConsumed] = useState(0)
	const [isOpenModal, setIsOpenModal ] = useState<boolean>(false)
	const [foods, setFoods] = useState<MealForm[]>(meallist)
	// const [foods, setFoods] = useState<MealForm[]>([])
	const [checkedMeal, setCheckedMeal] = useState<string[]>([])
	const [formData, setFormData ] = useState<MealForm>({
		id: "",
		title: "",
		description: "",
		calories: 0,
		type: ""
	})

  useEffect(() => {
    let totalCalories = foods.reduce((total, food) => {
      return total += food.calories
    }, 0)

    if (typeof totalCalories === "string") {
      totalCalories = parseInt(totalCalories);
    }

    setCaloriesRemaining(MY_DAILY_CALORIES - totalCalories)
    setCaloriesConsumed(totalCalories);

  }, [foods]);
	
	const openModal = () => {
		setIsOpenModal(true)
	}

	const closeModal = () => {
		setIsOpenModal(false)

		setFormData({
			id: "",
			title: "",
			description: "",
			calories: 0,
			type: ""
		})
	}

	const handleFormChanges = (e: h.JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement, Event>) => {
		const {name, value} = e.currentTarget
		setFormData((prev) => {
			return {
				...prev,
				[name]: value
			}
		})
	} 

	const saveForm = (e: FormEvent) => {
    e.preventDefault();
		
    // condition here check data before continuing
    setFormData((prev) => {
      return {
        ...prev,
        "id": crypto.randomUUID().replaceAll("-" , "")
      }
    })
    
    setFoods((prev) => [
      ...prev,
      formData
    ])

    closeModal()
	}

	const handleCheckBox = (e: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
		const { checked, value: checkValue } = e.currentTarget;

		if (checked) {
			setCheckedMeal((prev) => [
        ...prev,
        checkValue
      ])
		}

		if (!checked) {
			const idx = checkedMeal.findIndex(meal => meal === checkValue);
			checkedMeal.filter((_, i) => i != idx)
			setCheckedMeal([
				...checkedMeal.filter((_, i) => i != idx)
			])
		}
	}

	const deleteMeals = () => {
		const meals = foods.filter(meal => {
			if (checkedMeal.includes(meal.id)) return;
			return meal
		})

		setFoods(meals);
    setCheckedMeal([]);
	}

  return (
    <>
      <div className="flex justify-center bg-gray-200">
        <div className="w-[700px] h-screen bg-white p-2">
					<div className="py-2 w-full bg-gray-300">
            <div className="text-center">Today</div>
            <p></p>
          </div>

          <div className="mt-1 grid grid-cols-2 gap-1">
             <div className="p-1 bg-gray-200 capitalize text-center">
              <p className="text-2xl font-semibold">Consumed</p>
              <p>{ caloriesConsumed }</p>
            </div>
            <div className="p-1 bg-gray-200 capitalize text-center">
              <p className="text-2xl font-semibold">Remaining</p>
              <p>{ caloriesRemaining }</p>
            </div>
          </div>
          

					<div className="mt-1 w-full grid grid-cols-2">
            <button className="bg-green-100 p-1 cursor-pointer" onClick={openModal}>Add Meal</button>
            <button className="bg-red-100 p-1 cursor-pointer" onClick={deleteMeals}>
							Delete <span className={` ${checkedMeal.length ? 'inline-block': 'hidden'}`}>({checkedMeal.length})</span>
						</button>
          </div>

          <div className="w-full">
          {foods.map((meal) => (
              <div key={meal.id}>
                <div>
										<div className="group flex justify-between items-center border-b-1 transition-all border-b-gray-200 hover:bg-gray-50">
											<div className="px-2 flex items-center gap-5">
												<input className="h-5 w-5 accent-gray-600"
                          type="checkbox"
                          value={meal.id}
                          name="list"
                          onClick={handleCheckBox}
                        />
												<div>
													<p>{ meal.title }</p>
													<p className="text-sm">{ meal.description }</p>
												</div>
											</div>
											<p className="p-1 font-semibold">{ meal.calories}</p>
										</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
			
      {/* Modal */}
      <div className={`${isOpenModal ? 'block' : 'hidden'}`}>
				<div className="fixed inset-0 bg-black/50 z-40"></div>
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div className="bg-white p-6 shadow-lg w-[600px]">
						<form onSubmit={saveForm}>
							<h2 className="text-xl font-bold">Add Meal</h2>
							<div className="flex flex-col py-5 gap-2">
								<label htmlFor="">Title</label>
								<input class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									type='text'
									name="title"
									onChange={handleFormChanges}
								/>
								<label htmlFor="">description</label>
								<textarea class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									name="description"
									onChange={handleFormChanges}
								></textarea>	
								<label htmlFor="">Calories</label>
								<input class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									type='number'
									name="calories"
									onChange={handleFormChanges}
								/>
							</div>
							<div className="flex justify-end gap-1">
								<button className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
									type="submit"
								>Save</button>
								<button className="bg-gray-600 text-white px-4 py-2 hover:bg-gray-700"
									type="button"
									onClick={closeModal}
								>Close</button>
							</div>
						</form>
					</div>
				</div>
      </div>
    </>
  )
}
