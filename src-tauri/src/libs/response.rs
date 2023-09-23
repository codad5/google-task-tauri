
// save token response 
#[derive(serde::Serialize)]
pub struct SaveTokenResponse {
    pub message: String,
    pub token: String,
    pub success: bool,
}