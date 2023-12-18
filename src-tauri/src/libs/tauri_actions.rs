use std::env;

use tauri;

// super mod imports;
use super::auth::{AccessToken, Auth};
use super::filehelper::{ENV_FILE, ACCESS_TOKEN_FILE};


#[derive(serde::Serialize)] // Add this derive to enable JSON serialization
struct GreetResponse {
    message: String,
}


#[tauri::command]
pub fn test_command() -> String {
    println!("access token path: {}", &*ACCESS_TOKEN_FILE);
    println!("ENV_FILE: {}", ENV_FILE);
    return env::var("DB_PASSWORD").unwrap();
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
pub fn greet(name: String) -> String {
    let response = GreetResponse {
        message: format!("Hello, {}! You've been greeted from Rust!", name),
    };

    // Serialize the response object to JSON and return as a string
    serde_json::to_string(&response).expect("JSON serialization error")
}

// remember to call `.manage(MyState::default())`
#[tauri::command]
pub fn save_access_token(token: String) -> String {
    dotenv::from_filename(ENV_FILE).ok();
    return Auth::save_access_token(token);
}

// a command to load the access token from the file
#[tauri::command]
pub fn load_access_token() -> String {
    dotenv::from_filename(ENV_FILE).ok();
    return Auth::load_access_token();
}


#[tauri::command]
pub fn save_code(code: String) -> String {
    dotenv::from_filename(ENV_FILE).ok();
    return Auth::save_auth_code(code);
}

#[tauri::command]
pub fn load_code() -> String {
    dotenv::from_filename(ENV_FILE).ok();
    return Auth::load_auth_code();
}