use std::env;

use tauri;

// super mod imports;
use super::auth::{AccessToken, Auth};
use super::filehelper::{ENV_FILE, ACCESS_TOKEN_FILE};
use super::response::{SaveAccessTokenResponse, SaveTokenResponse, GreetResponse};



#[tauri::command]
#[specta::specta]
pub fn test_command() -> String {
    println!("access token path: {}", &*ACCESS_TOKEN_FILE);
    println!("ENV_FILE: {}", ENV_FILE);
    return env::var("DB_PASSWORD").unwrap();
}

#[tauri::command]
#[specta::specta]
pub fn greet(name: String) -> GreetResponse {
    return GreetResponse {
        message: format!("Hello, {}! You've been greeted from Rust!", name),
    };
}

// remember to call `.manage(MyState::default())`
#[tauri::command]
#[specta::specta]
pub fn save_access_token(token: String) -> SaveAccessTokenResponse {
    dotenv::from_filename(ENV_FILE).ok();
    return Auth::save_access_token(token);
}

// a command to load the access token from the file
#[tauri::command]
#[specta::specta]
pub fn load_access_token() -> AccessToken {
    dotenv::from_filename(ENV_FILE).ok();
    return Auth::load_access_token();
}


#[tauri::command]
#[specta::specta]
pub fn save_code(code: String) -> SaveTokenResponse {
    dotenv::from_filename(ENV_FILE).ok();
    return Auth::save_auth_code(code);
}

#[tauri::command]
#[specta::specta]
pub fn load_code() -> String {
    dotenv::from_filename(ENV_FILE).ok();
    return Auth::load_auth_code();
}