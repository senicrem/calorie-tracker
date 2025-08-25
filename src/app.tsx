import { useState } from 'preact/hooks'
import './app.css'

export function App() {
  const [dailyCalories, setDailyCalories] = useState(1650)

  return (
    <>
      <div className="text-xl bg-gray-200 h-screen">
        <button onClick={() => setDailyCalories((dailyCalories) => dailyCalories + 1)}>
          Calories is <p className="inline font-bold">{dailyCalories}</p>
        </button>
      </div>
    </>
  )
}
