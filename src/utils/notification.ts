import { Store, 
  type NOTIFICATION_CONTAINER,
  type NOTIFICATION_TYPE,
  type NOTIFICATION_INSERTION, 
} from 'react-notifications-component';

const defaultOptions = {
  title: "Wonderful!",
  message: "teodosii@react-notifications-component",
  type: "success" as NOTIFICATION_TYPE,
  insert: "top" as NOTIFICATION_INSERTION,
  container: "top-right" as NOTIFICATION_CONTAINER,
  animationIn: ["animate__animated", "animate__fadeIn"],
  animationOut: ["animate__animated", "animate__fadeOut"],
  dismiss: {
    duration: 5000,
    onScreen: true
  }
}

export function notify(type = "", message = "", timeout = 5000) {
  let settings = { ...defaultOptions }
  settings.title = ""
  settings.type = type as NOTIFICATION_TYPE
  settings.message = message
  settings.dismiss.duration = timeout
  Store.addNotification(settings)
}
