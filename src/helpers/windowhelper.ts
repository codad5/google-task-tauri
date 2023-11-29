import { Options, isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/api/notification";
import {showMenu} from "tauri-plugin-context-menu";

// Disable the right-click menu and text selection.
export function loadContextmenu() {
  if (window.location.hostname === 'tauri.localhost') {
    return
  }
  window.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    pushNotification("Click Context")
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
        sendNotification(options);
    });
}

