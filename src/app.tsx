import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import type { FormEvent } from 'preact/compat'
import meallist from "./data/meallist.json"
import { Plus, Trash } from "./assets/Icons"

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
      if (!prev.description) {
        prev.description = "No Description."
      }

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
      <div className="flex justify-center bg-gray-200 font-sans">
        <div className="flex flex-col w-[700px] h-screen bg-white p-2">
          <div className="grid grid-cols-2 gap-1 h-40">
             <div className="p-1 bg-gray-200 capitalize text-center flex flex-col items-center justify-center">
              <p className="text-2xl font-light">Consumed</p>
              <p className="text-2xl font-semibold">{ caloriesConsumed }</p>
            </div>
            <div className="p-1 bg-gray-200 capitalize text-center  flex flex-col items-center justify-center">
              <p className="text-2xl font-light">Remaining</p>
              <p className="text-2xl font-semibold">{ caloriesRemaining }</p>
            </div>
          </div>

          <div className="mt-1 grid gap-1 w-full">
            <button className="bg-gray-700 text-white p-3 cursor-pointer hover:bg-gray-600 transition-colors" onClick={openModal}>
              <div className="flex justify-center items-center">
                <Plus className="h-5" />
                <p>Meal</p>
              </div>
            </button>
          </div>

          <div className="w-full flex-grow overflow-auto">
          {foods.length ? foods.map((meal) => (
              <label className="cursor-pointer" key={meal.id}>
                <div>
										<div className="group flex justify-between items-center border-b-1 transition-all border-b-gray-200 hover:bg-gray-50">
											<div className="flex items-center gap-3">
												<input className="h-10 w-10 accent-green-700"
                          type="checkbox"
                          value={meal.id}
                          name="list"
                          onClick={handleCheckBox}
                        />
												<div>
													<p className="font-semibold">
                            { meal.title }
                          </p>
													<p className="font-light italic truncate">
                            { meal.description.length > 70 ? meal.description.slice(0, 70) + "..." : meal.description }
                          </p>
												</div>
											</div>
											<p className="px-5 h-full font-semibold text-lg">
                        {meal.calories}<span className="text-sm font-normal text-red-600"> Kcal</span>
                      </p>
										</div>
                </div>
              </label>
            )) : (
              <div className="h-full flex justify-center items-center">
                <div className="text-center text-gray-500">
                  <p className="mb-2">No items yet — do you want to add one?</p>
                  <a className="underline font-semibold hover:text-blue-700 transition-colors delay-200 cursor-pointer" 
                    onClick={(e) => {
                      e.preventDefault()
                      openModal()
                    }}>
                    Add Item
                  </a>
                </div>
              </div>
            )}
          </div>
              
        {checkedMeal.length > 0 && (
          <button className="bg-red-700 text-white p-2 cursor-pointer hover:bg-red-600 transition-colors" onClick={deleteMeals}>
            <div className="flex justify-center items-center gap-1">
              <Trash className="h-5" />
              <p className="text-lg font-semibold">
                <span>{checkedMeal.length}</span>
              </p>
            </div>
          </button>
        )}

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
								<input class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
									type='text'
									name="title"
									onChange={handleFormChanges}
								/>
								<label htmlFor="">description</label>
								<textarea class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
									name="description"
									onChange={handleFormChanges}
								></textarea>	
								<label htmlFor="">Calories</label>
								<input class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
									type='number'
									name="calories"
									onChange={handleFormChanges}
								/>
							</div>
							<div className="flex justify-end gap-1 font-semibold">
								<button className="border-2 text-gray-700 px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
									type="submit"
								>Save</button>
								<button className="bg-gray-700 text-white px-4 py-2 hover:bg-gray-600 transition-colors cursor-pointer"
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
