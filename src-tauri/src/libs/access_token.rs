use super::filehelper::ACCESS_TOKEN_FILE;
use super::response::SaveAccessTokenResponse;

use std::{env, io::Write};

use cocoon::Cocoon;
use borsh::{BorshDeserialize, to_vec};




#[derive(borsh::BorshDeserialize, borsh::BorshSerialize, Debug, serde::Serialize, serde::Deserialize, Clone)]
pub struct AccessToken {
    access_token: String,
    expires_in: i32,
    refresh_token: String,
    scope: String,
    token_type: String,
    id_token: String,
}


impl AccessToken {
    pub fn save(&self) -> SaveAccessTokenResponse {
        let encoded = to_vec(self).unwrap();
        let password: String = env::var("DB_PASSWORD").unwrap();
        let mut cocoon = Cocoon::new(password.as_bytes());
        println!("About to open db file");
        let mut file = std::fs::OpenOptions::new()
                        .create(true)
                        .write(true)
                        .open(&*ACCESS_TOKEN_FILE).unwrap();
        let metadata = file.metadata().unwrap();
        let mut permissions = metadata.permissions();
        println!("permissions: {:?}", permissions);
        permissions.set_readonly(false);
        println!("permissions: {:?}", permissions);
        cocoon.dump(encoded, &mut file).unwrap();
        return SaveAccessTokenResponse {
            message: format!("Token saved to file!"),
            success: true,
            token: self.clone(),
        }
    }

    pub fn load() -> AccessToken {
        let mut file = std::fs::File::open(&*ACCESS_TOKEN_FILE).unwrap();
        let binding = env::var("DB_PASSWORD").unwrap();
        let cacoon = Cocoon::new(binding.as_bytes());
        return match cacoon.parse(&mut file) {
            Ok(data) => AccessToken::try_from_slice(&data).unwrap(),
            Err(_) => { 
                println!("Error reading file");
                return AccessToken {
                    access_token: "".to_string(),
                    expires_in: 0,
                    refresh_token: "".to_string(),
                    scope: "".to_string(),
                    token_type: "".to_string(),
                    id_token: "".to_string(),
                };
            }
        };
    }
}