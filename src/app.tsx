import { Main } from "./assets/Main"
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import 'preact/debug';

export function App() {
  return (
    <>
      <ReactNotifications />
      <Main />
    </>
  )
}
