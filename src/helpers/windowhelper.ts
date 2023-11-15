import { Options, isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/api/notification";

// Disable the right-click menu and text selection.
export function disableMenu() {
  if (window.location.hostname !== 'tauri.localhost') {
    return
  }

  document.addEventListener('contextmenu', e => {
    e.preventDefault();
    return false;
  }, { capture: true })

  document.addEventListener('selectstart', e => {
    e.preventDefault();
    return false;
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

