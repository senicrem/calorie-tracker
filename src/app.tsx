import './app.css'
import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import type { FormEvent } from 'preact/compat'
import list from "./assets/meallist.json"

export function App() {
  const [dailyCalories, setDailyCalories] = useState(1500)
	const [isOpenModal, setIsOpenModal ] = useState<boolean>(false)
	const [formData, setFormData ] = useState<MealForm>({
		id: "",
		title: "",
		description: "",
		calories: 0,
		type: ""
	})

	const foods = Object.groupBy(list, (l) => l.type);
  const caloriesData = [
    { type: "consumed", calories: 100 },
    { type: "remaining", calories: 1400 },
  ]
console.log(foods);
  useEffect(() => {
    console.log("load database here!")
  }, []);

  const caloriesPerCategory = (list:MealForm[] | undefined) => {
		if (list === undefined) return 0;

    const total = list.reduce((sum, l) => {
      return sum += l.calories
    }, 0)

    return total
  }
	
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

    alert('successfully saved!');
    closeModal()
	}

	const onClickMealList = (id: string) => {
		
	}

  return (
    <>
      <div className="flex justify-center bg-gray-200">
        <div className="w-[700px] h-screen bg-white p-2">
          <div className="grid grid-cols-2 gap-2">
            {caloriesData.map((x) => (
              <div className="p-1 bg-gray-200 capitalize text-center">
                <p className="text-2xl font-semibold">{ x.calories }</p>
                <p>{ x.type }</p>
              </div>
            ))}
          </div>

          <div className="mt-2 py-2 w-full bg-gray-300">
            <div className="text-center">Today</div>
            <p></p>
          </div>

          <div className="w-full mt-2">
          {Object.entries(foods).map(([mealType, mealList]) => (
              <div>
                <div className="bg-gray-200 p-2 uppercase flex justify-between items-center">
                <div className="flex gap-2">
                  <p className="bg-black text-white flex justify-center items-center p-1 hover:scale-110 transition-transform cursor-pointer" onClick={openModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </p>
                  <p>{ mealType }</p>
                </div>
                  <p>{ caloriesPerCategory(mealList) }</p>
                </div>
                <div>
                  {mealList?.map((meal) => (
										<div className="group flex justify-between items-center border-b-1 transition-all border-b-gray-200 hover:bg-gray-50">
											<div className="px-2">
												<p>{ meal.title }</p>
												<p className="text-sm">{ meal.description }</p>
											</div>
											<p className="p-1 font-semibold">{ meal.calories}</p>
										</div>
                  ))}
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
							<h2 className="text-xl font-bold">Add {dailyCalories}</h2>
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
