import { BaseDirectory } from "@tauri-apps/api/fs";

export default {
    fs: {
        DEFAULT_DIRECTORY: BaseDirectory.AppLocalData,
        
    },
    auth: {
        GOOGLE_OAUTH_ENDPOINT: "https://accounts.google.com/o/oauth2/v2/auth",
        SCOPE: "https://www.googleapis.com/auth/tasks " +
            "https://www.googleapis.com/auth/userinfo.profile " +
            "https://www.googleapis.com/auth/userinfo.email",
    },

    storage: {
        paths: {
            access_token: "access_token.db",
            tasks: "tasks.json",
            authcode: "auth_code.txt",
            user_profile: "user_profile.json",
        }
    },
};