import { Main } from "./assets/Main"
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import 'preact/debug';
import { useEffect } from "preact/hooks";
import { store as STORE } from "./store";
import { IndexedDBWrapper } from "./utils/indexedDbWrapper";
import type { MealForm } from "./types/global";

export function App() {

  const connectToDB = async() => {
    let dbInstance = new IndexedDBWrapper("foods", 1)
    await dbInstance.connect()
    STORE.actions.setDBInstance(dbInstance)
  }

  useEffect(() => {
    (async() => {
      await connectToDB();
      if (!STORE.state.DBInstance.value) return;

      const items = await STORE.state.DBInstance.value.getItems('items')
      STORE.actions.storeFoodItems(items as MealForm[])

      const settings = await STORE.state.DBInstance.value.getItems('settings')
      if (!(typeof settings != "undefined" && Array.isArray(settings))) return;
      STORE.actions.setCaloriesDaily(settings[0].daily_calorie_count)
    })()
  })

  return (
    <>
      <ReactNotifications />
      <Main />
    </>
  )
}
