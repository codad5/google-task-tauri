use std::io::Write;
use std::env;
use lazy_static::lazy_static;
use tauri::api::path::{resolve_path, BaseDirectory};
use tauri::Env;

pub const ENV_FILE: &str = "../.env.local";

pub const USERS_FILES: [&str; 4] = ["access_token.db", "auth_code.db", "tasks.json", "user_profile.json"];




pub fn initialize_user_files() {
    for file in USERS_FILES.iter() {
        let file_path = get_app_local_data_dir(file);
        println!("file path: {}", file_path);
    }
}

// const PATHS = 
pub fn get_app_local_data_dir(file_name: &str) -> String {
    let context = tauri::generate_context!();
    // let path = BaseDirectory::AppLocalData.variable()
    let path = resolve_path(
        &context.config(),
        context.package_info(),
        &Env::default(),
        file_name,
        Some(BaseDirectory::AppLocalData),
    ).expect("failed to resolve path");
    let path = path.to_str().unwrap().to_string();
    println!("path: {} \n file name: {} \n", path, file_name);
    // check if file exists
    if !std::path::Path::new(file_name).exists() {
        println!("File does not exist, creating file {} for {}", file_name, path);
        // create file
        let mut file = std::fs::File::create(&path).unwrap();
        // if a json file, write empty json
        if file_name.ends_with(".json") {
            println!("writing empty json");
            file.write_all(b"{}").unwrap();
        }

    }
    path
}

pub fn resolve_access_token_file() -> String {
    let access_token_file: String = get_app_local_data_dir("access_token.db");
    println!("access token path: {}", access_token_file);
    access_token_file
}

pub fn resolve_auth_code_file() -> String {
    let auth_code_file: String = get_app_local_data_dir("auth_code.db");
    println!("auth code path: {}", auth_code_file);
    auth_code_file
}


lazy_static! {
    pub static ref ACCESS_TOKEN_FILE: String = resolve_access_token_file();
    pub static ref AUTH_CODE_FILE: String = resolve_auth_code_file();
}

