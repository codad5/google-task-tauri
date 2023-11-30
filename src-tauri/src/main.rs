// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod libs;

use tauri_plugin_log::{LogTarget};
use libs::tauri_actions::{save_access_token,load_access_token, greet, test_command, save_code, load_code};
use libs::filehelper::{ENV_FILE, initialize_user_files};


fn main() {
    dotenv::from_filename(ENV_FILE).ok();
    initialize_user_files();
    tauri::Builder::default()
        .plugin(tauri_plugin_context_menu::init())
        .plugin(tauri_plugin_oauth::init())
        .plugin(tauri_plugin_log::Builder::default().targets([
            LogTarget::LogDir,
            LogTarget::Stdout,
            LogTarget::Webview,
        ]).build())
        .invoke_handler(tauri::generate_handler![
            save_access_token,
            load_access_token,
            greet,
            test_command,
            save_code,
            load_code,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
