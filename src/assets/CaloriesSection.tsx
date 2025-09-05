import { h } from 'preact'
import { store } from "../store"
import Modal from "./Modal"
import { useSignal } from "@preact/signals"
import { notify } from '../utils/notification'

export default function Header() {
  const isOpenModal = useSignal(false)
  const newCalorieCount = useSignal(0)

  const onUpdateDailyCalories = async() => {
    await store.actions.setCaloriesDaily(newCalorieCount.value)
    closeModal()
    notify("success","Daily Calorie Count is successfully updated!", 700)
  }

  const openModal = () => {
    isOpenModal.value = true
  }

  const closeModal = () => isOpenModal.value = false
  
  return (
    <>
    <div>
      <div className={`relative group cursor-pointer w-full bg-gray-200 h-24 flex flex-col justify-center items-center mb-1`}>
        <p className="text-2xl font-light">Daily Calorie Count</p>
        <p className="text-2xl font-semibold">{ store.state.caloriesDaily.value }</p>
        <button className="absolute delay-400 bottom-1 underline text-blue-700 transition-all opacity-0 text-xs group-hover:opacity-100 cursor-pointer"
            onClick={openModal}
          >Edit</button>
      </div>
      <div className="grid grid-cols-2 gap-1 h-24">
        <div className="p-1 bg-gray-200 capitalize text-center flex flex-col items-center justify-center">
          <p className="text-2xl font-light">Consumed</p>
          <p className="text-2xl font-semibold">{ store.getters.consumedCalories.value }</p>
        </div>
        <div className="p-1 bg-gray-200 capitalize text-center  flex flex-col items-center justify-center">
          <p className="text-2xl font-light">Remaining</p>
          <p className="text-2xl font-semibold">{ store.getters.remainingCalories.value }</p>
        </div>
      </div>
    </div>

      <Modal show={isOpenModal.value}>
        <div className="bg-white p-6 shadow-lg w-[600px]">
          <div className="flex flex-col py-5 gap-2">
            <label className="font-semibold">Calorie Daily Count</label>
            <input class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              type='number'
              onBlur={(e: h.JSX.TargetedEvent<HTMLInputElement, Event>): void => {
                newCalorieCount.value = parseInt(e.currentTarget.value)
              }}
            />
          </div>
          <div className="flex justify-end gap-1 font-semibold">
            <button className="border-2 text-gray-700 px-4 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
              type="button"
              onClick={onUpdateDailyCalories}
            >Update</button>
            <button className="bg-gray-700 text-white px-4 py-2 hover:bg-gray-600 transition-colors cursor-pointer"
              type="button"
              onClick={closeModal}
            >Close</button>
          </div>
        </div>
      </Modal>
    </>
  )
}