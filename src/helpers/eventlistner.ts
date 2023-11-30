import { listen } from "@tauri-apps/api/event";

type listnerCallback<T = any> = {
    onSucess: (data: T) => any,
    onError ?: (err: Error) => any
}

export async function listen_for_auth_code(callback: listnerCallback<string | null>) {
    const unlisten = await listen("oauth://url", async (data) => {
      try {
        console.log("gotten data")
        if (!data.payload) return;
        const url = new URL(data.payload as string);
        const code = new URLSearchParams(url.search).get("code");
        return callback.onSucess(code);
      } catch (err) {
        unlisten();
        return callback.onError ? callback.onError(err as Error) : null;
      }
    });
  return;
}

