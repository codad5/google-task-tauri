use super::auth::AccessToken;
// save token response 
#[derive(serde::Serialize)]
pub struct SaveTokenResponse {
    pub message: String,
    pub token: String,
    pub success: bool,
}


#[derive(serde::Serialize, serde::Deserialize)]
pub struct SaveAccessTokenResponse {
    pub message: String,
    pub success: bool,
    pub token: AccessToken,
}
