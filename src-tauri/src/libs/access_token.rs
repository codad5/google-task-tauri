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
        let password: String = env::var("PASSWORD").unwrap();
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
        let binding = env::var("PASSWORD").unwrap();
        let cacoon = Cocoon::new(binding.as_bytes());
        let encoded = cacoon.parse(&mut file).unwrap();
        return AccessToken::try_from_slice(&encoded).unwrap();
    }
}