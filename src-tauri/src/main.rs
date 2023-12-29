// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod libs;

use tauri_plugin_log::{LogTarget};
use specta::collect_types;
use tauri_specta::{ts, js};


use libs::tauri_actions::{save_access_token,load_access_token, greet, test_command, save_code, load_code};
use libs::filehelper::{ENV_FILE, initialize_user_files};


fn run_specta() {

    println!("Running specta to generate typescript bindings");
     #[cfg(debug_assertions)]
    ts::export(collect_types![
            save_access_token,
            load_access_token,
            greet,
            test_command,
            save_code,
            load_code,
    ], "../src/helpers/commands.ts").unwrap();
}

fn main() {
    dotenv::from_filename(ENV_FILE).ok();

    // set default DB_PASSWORD env variable if not set
    // this is setting is for now till we have a better way to handle this env variable on build
    if env::var("DB_PASSWORD").is_err() {
        env::set_var("DB_PASSWORD", "password");
    }

    initialize_user_files();
    run_specta();

    tauri::Builder::default()
    .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
        println!("{}, {argv:?}, {cwd}", app.package_info().name);
        // app.emit_all("single-instance", Payload { args: argv, cwd }).unwrap();
    }))
    .plugin(tauri_plugin_context_menu::init())
    .plugin(tauri_plugin_oauth::init())
    .plugin(tauri_plugin_log::Builder::default().targets([
        LogTarget::LogDir,
        LogTarget::Stdout,
        LogTarget::Webview,
    ])
    .build())
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
