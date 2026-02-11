import { useThemeStore } from '@/stores/theme'
import type { MessageApi, NotificationApi, DialogApi, LoadingBarApi, ModalApi } from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'

export class Feedback {
  private static instance?: Feedback

  message: MessageApi
  dialog: DialogApi
  notification: NotificationApi
  loadingBar: LoadingBarApi
  modal: ModalApi

  constructor(
    message: MessageApi,
    dialog: DialogApi,
    notification: NotificationApi,
    loadingBar: LoadingBarApi,
    modal: ModalApi,
  ) {
    this.message = message
    this.dialog = dialog
    this.notification = notification
    this.loadingBar = loadingBar
    this.modal = modal
  }

  public static getInstance() {
    if (!Feedback.instance) {
      const { message, dialog, notification, loadingBar, modal } = createDiscreteApi(
        ['message', 'dialog', 'notification', 'loadingBar', 'modal'],
        {
          configProviderProps: {
            themeOverrides: useThemeStore().themeOverride,
          },
        },
      )
      Feedback.instance = new Feedback(message, dialog, notification, loadingBar, modal)
    }
    return Feedback.instance
  }
}
