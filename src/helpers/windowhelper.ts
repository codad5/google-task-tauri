import { Options, isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/api/notification";
import { showMenu } from "tauri-plugin-context-menu";

// Disable the right-click menu and text selection.
export function loadContextmenu() {
  if (window.location.hostname !== 'tauri.localhost') {
    return
  }
  window.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    showMenu({
      items: [
        {
          label: "Reload",
          disabled: false,
          event: () => {
            window.location.reload();
          },
        },
      ],
    })
  }, { capture: true })
}


//  TODO: Remove the counter 
let notificationCount = 0;
export function pushNotification(options: string | Options) {
    isPermissionGranted().then((granted) => {
        if (!granted) {
            requestPermission().then((granted) => {
                if (!granted) {
                    console.log("permission not granted");
                    return;
                }
            });
        }
      console.log("permission granted");
      if (typeof options === 'object') options.body = `${options.body} ${notificationCount}`;
      if (typeof options === 'string') options = `${options} ${notificationCount}`;
      sendNotification(options);
      notificationCount++;
    });
}


