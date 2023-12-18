use specta::Type;
use serde::{Deserialize, Serialize};
use super::auth::AccessToken;
// save token response 
#[derive(Serialize, Type)]
pub struct SaveTokenResponse {
    pub message: String,
    pub token: String,
    pub success: bool,
}


#[derive(Serialize, Type)]
pub struct SaveAccessTokenResponse {
    pub message: String,
    pub success: bool,
    pub token: AccessToken,
}


#[derive(Serialize, Type)]
pub struct GreetResponse {
    pub message: String,
}