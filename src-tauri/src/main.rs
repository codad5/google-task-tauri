// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod libs;

use std::io::Write;

use libs::response::SaveTokenResponse;

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

// function to save google token to file
#[tauri::command]
fn save_token(token: &str) -> String {
    // save token to file
    let mut file = std::fs::File::create("token.txt").unwrap();
    file.write_all(token.as_bytes()).unwrap();

    // return response
    let response = SaveTokenResponse {
        message: format!("Token saved to file!"),
        token: token.to_string(),
        success: true,
    };

    // Serialize the response object to JSON and return as a string
    serde_json::to_string(&response).expect("JSON serialization error")
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_oauth::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
