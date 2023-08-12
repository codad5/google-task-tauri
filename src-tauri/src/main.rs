// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[derive(serde::Serialize)] // Add this derive to enable JSON serialization
struct GreetResponse {
    message: String,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    let response = GreetResponse {
        message: format!("Hello, {}! You've been greeted from Rust!", name),
    };

    // Serialize the response object to JSON and return as a string
    serde_json::to_string(&response).expect("JSON serialization error")
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
