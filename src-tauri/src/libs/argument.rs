use specta::Type;
use serde::{Deserialize, Serialize};


#[derive(Deserialize, Type)]
pub struct MyCustomArgumentType {
    pub foo: String,
    pub bar: i32,
}