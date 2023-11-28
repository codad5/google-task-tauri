use std::io::Write;
use tauri::api::path::local_data_dir;
use lazy_static::lazy_static;
use tauri::api::path::{resolve_path, BaseDirectory};
use tauri::Env;

pub const ENV_FILE: &str = "../.env.local";


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
    path.to_str().unwrap().to_string()
}

pub fn resolve_access_token_file() -> String {
    let access_token_file: String = get_app_local_data_dir("access_token.db");
    println!("access token path: {}", access_token_file);
    // check if file exists
    if !std::path::Path::new(&access_token_file).exists() {
        // create file
        let mut file = std::fs::File::create(&access_token_file).unwrap();
        // write empty array to file
        file.write_all("".as_bytes()).unwrap();
    }
    access_token_file
}

lazy_static! {
    pub static ref ACCESS_TOKEN_FILE: String = resolve_access_token_file();
}
