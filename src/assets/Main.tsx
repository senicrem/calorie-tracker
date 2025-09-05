import { h } from 'preact'
import { useEffect } from 'preact/hooks'
import type { FormEvent } from 'preact/compat'
import type { MealForm } from '../types/global'
import { notify } from '../utils/notification'
import Modal from './Modal'
import { Plus, Trash } from "./Icons"
import { useSignal } from '@preact/signals';
import { store } from '../store'
import { IndexedDBWrapper } from '../utils/indexedDbWrapper'

export function Main() {
  const isOpenModal = useSignal<boolean>(false)
  const toDeleteIds = useSignal<string[]>([])
  const formData = useSignal<MealForm>({
    id: "",
    title: "",
    description: "",
    calories: 0,
  })

  const DB = useSignal<IndexedDBWrapper>()

  useEffect(() => {
    (async() => {
      await connectToDB();
      if (!DB.value) return;
      // get items on indexedDb
      const items = await DB.value.getItems('items')
      store.actions.storeFoodItems(items as MealForm[])
    })()
  }, [])

  const connectToDB = async() => {
    let dbInstance = new IndexedDBWrapper("foods", 1)
    await dbInstance.connect()
    DB.value = dbInstance
  }

  const openModal = () => {
    isOpenModal.value = true
  }

  const closeModal = () => {
    isOpenModal.value = false

    formData.value = {
      id: "",
      title: "",
      description: "",
      calories: 0,
    }
  }

  const handleFormChanges = (e: h.JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement, Event>) => {
    const { name, value } = e.currentTarget
    formData.value = {
      ...formData.value,
      [name]: name === "calories" ? parseFloat(value) : value
    }
  }

  const saveForm = async(e: FormEvent) => {
    e.preventDefault();

    formData.value.id = crypto.randomUUID().replaceAll("-", "")

    if (formData.value.description.length === 0 ) {
      formData.value.description = "No Description."; 
    }

    await DB.value?.add('items', formData.value)
    store.actions.addFoodItem(formData.value)
    notify("success","New item created", 700)
    closeModal()
  }

  const handleCheckBox = (e: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const { checked, value: id } = e.currentTarget;

    if (checked) {
      toDeleteIds.value = [ ...toDeleteIds.value, id ]
    }

    if (!checked) {
      const idx = toDeleteIds.value.findIndex(meal => meal === id);
      
      toDeleteIds.value = [
        ...toDeleteIds.value.filter((_, i) => i != idx)
      ]
    }
  }

  const deleteMeals = async () => {
    const dbDeleteFunctions: Promise<unknown>[] = []

    toDeleteIds.value.forEach(id => {
      if (!DB.value) return;
      dbDeleteFunctions.push(
        DB.value.delete('items', id)
      )
    })
    
    await Promise.all(dbDeleteFunctions)
    store.actions.deleteFoodItems(toDeleteIds.value)
    notify("danger", `Gone! ${toDeleteIds.value.length} item/s removed.`, 700)
    toDeleteIds.value = [];
  }

  return (
    <>
      <div className="flex justify-center bg-gray-200 font-sans">
        <div className="flex flex-col w-[700px] h-screen bg-white p-2">
          <div className="grid grid-cols-2 gap-1 h-40">
            <div className="p-1 bg-gray-200 capitalize text-center flex flex-col items-center justify-center">
              <p className="text-2xl font-light">Consumed</p>
              <p className="text-2xl font-semibold">{ store.getters.consumedCalories.value }</p>
            </div>
            <div className="p-1 bg-gray-200 capitalize text-center  flex flex-col items-center justify-center">
              <p className="text-2xl font-light">Remaining</p>
              <p className="text-2xl font-semibold">{ store.getters.remainingCalories.value }</p>
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
            {store.getters.getfoodItems.value.length ? store.getters.getfoodItems.value.map((meal) => (
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
                          {meal.title}
                        </p>
                        <p className="font-light italic truncate">
                          {meal.description.length > 70 ? meal.description.slice(0, 70) + "..." : meal.description}
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

          {toDeleteIds.value.length > 0 && (
            <button className="bg-red-700 text-white p-2 cursor-pointer hover:bg-red-600 transition-colors" onClick={deleteMeals}>
              <div className="flex justify-center items-center gap-1">
                <Trash className="h-5" />
                <p className="text-lg font-semibold">
                  Delete
                  <span className="font-semilight"> ({toDeleteIds.value.length})</span>
                </p>
              </div>
            </button>
          )}
        </div>
      </div>

      <Modal show={isOpenModal.value}>
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
      </Modal>
    </>
  )
}
