use tauri;

// super mod imports;
use super::access_token::AccessToken;
use super::response::SaveAccessTokenResponse;
use super::filehelper::{ENV_FILE, ACCESS_TOKEN_FILE};


#[derive(serde::Serialize)] // Add this derive to enable JSON serialization
struct GreetResponse {
    message: String,
}


#[tauri::command]
pub fn test_command() -> String {
    println!("access token path: {}", &*ACCESS_TOKEN_FILE);
    println!("ENV_FILE: {}", ENV_FILE);
    return "ACCESS_TOKEN_FILE".to_string() 
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
    let content : AccessToken = serde_json::from_str(&token).unwrap();
    let response : SaveAccessTokenResponse = content.save();
    // Serialize the response object to JSON and return as a string
    serde_json::to_string(&response).expect("JSON serialization error")
}

// a command to load the access token from the file
#[tauri::command]
pub fn load_access_token() -> String {
    dotenv::from_filename(ENV_FILE).ok();
    let response : AccessToken = AccessToken::load();
    println!("response: {:?}", response);
    // Serialize the response object to JSON and return as a string
    serde_json::to_string(&response).expect("JSON serialization error")
}

