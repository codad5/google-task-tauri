// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod libs;

use libs::tauri_actions::{save_access_token,load_access_token, greet, test_command};
use libs::filehelper::ENV_FILE;



fn main() {
    dotenv::from_filename(ENV_FILE).ok();
    tauri::Builder::default()
        .plugin(tauri_plugin_oauth::init())
        .invoke_handler(tauri::generate_handler![
            save_access_token,
            load_access_token,
            greet,
            test_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
