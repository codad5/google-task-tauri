import { invoke, shell } from "@tauri-apps/api";
import axios from "axios";
import { AccessToken, UserProfile } from "../types/googleapis";
import { BaseDirectory, readTextFile, removeFile, writeTextFile } from "@tauri-apps/api/fs";
import { CLIENT_ID, CLIENT_SECRET } from "../assets/credentials";


const DEFAULT_DIRECTORY = BaseDirectory.Download;
const GOOGLE_OAUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const SCOPE = "https://www.googleapis.com/auth/tasks " +
  "https://www.googleapis.com/auth/userinfo.profile " +
  "https://www.googleapis.com/auth/userinfo.email";

const port = await generatePort();

export async function getAccessToken(code: string) : Promise<AccessToken> {
    try {
        const data = {
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: getLocalHostUrl(port),
            grant_type: "authorization_code",
        };
        console.log(data, "data");
        const response = await axios.post("https://oauth2.googleapis.com/token", data);
        // Extract and set the access token in the state
        console.log(response, "response from getAccessToken");
        return response.data;
    }
    catch (error) {
        console.log(error, "error from getAccessToken");
        throw new Error("Error getting access token");
    }

}


export async function fetchUserProfile(accessToken : string) : Promise<UserProfile> {
  try {
    // Fetch user profile information using the access token
    const response = await axios.get<UserProfile>("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response.data, "response from fetchUserProfile");
    return response.data;
  }catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Error fetching user profile");
  }
}


 // to handle login to get auth
export async function openAuthWindow() {
    // create and set a new URL object with the endpoint and query parameters
    console.log("openAuthWindow", CLIENT_ID, CLIENT_SECRET);
    return
    const url = new URL(GOOGLE_OAUTH_ENDPOINT);
    url.searchParams.append("scope", SCOPE);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("client_id", CLIENT_ID);
    url.searchParams.append("redirect_uri", getLocalHostUrl(port));
    url.searchParams.append("include_granted_scopes", "true");
    url.searchParams.append("state", "state_parameter_passthrough_value");
    shell.open(url.href);
}

// save the auth code to storage
export async function saveAuthCode(code: string) {
    try {
        return await writeTextFile("auth_code.txt", code, { dir: DEFAULT_DIRECTORY });
    } catch (error) {
        console.error("Error saving auth code:", error);
        throw new Error("Error saving auth code");
    }
}

// get the auth code from storage
export async function getAuthCode() {
    try {
        return await readTextFile("auth_code.txt", { dir: DEFAULT_DIRECTORY });
    } catch (error) {
        console.error("Error getting auth code:", error);
        return null;
    }
}

export async function saveAccessToken(accessToken: string) {
    try {
        return await writeTextFile("access_token.json", accessToken, { dir: DEFAULT_DIRECTORY });
    } catch (error) {
        console.error("Error saving access token:", error);
        throw new Error("Error saving access token");
    }
}



export async function getAccessTokenFromStorage() {
    try {
        const access_token = await readTextFile("access_token.json", { dir: DEFAULT_DIRECTORY });
        return JSON.parse(access_token) as AccessToken;
    } catch (error) {
        console.error("Error getting access token:", error);
        return null;
    }
}


export async function deleteAccessToken() {
    try {
        return await removeFile("access_token.json", { dir: DEFAULT_DIRECTORY });
    } catch (error) {
        console.error("Error deleting access token:", error);
        throw new Error("Error deleting access token");
    }
}

export async function saveUserProfile(userProfile: UserProfile) {
    try {
        return await writeTextFile("user_profile.json", JSON.stringify(userProfile), { dir: DEFAULT_DIRECTORY });
    } catch (error) {
        console.error("Error saving user profile:", error);
        throw new Error("Error saving user profile");
    }
}

export async function getUserProfileFromStorage() {
    try {
        const userProfile = await readTextFile("user_profile.json", { dir: DEFAULT_DIRECTORY });
        return JSON.parse(userProfile) as UserProfile;
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
}






function getLocalHostUrl(port: number) {
  return `http://localhost:${port}`;
}

async function generatePort() : Promise<number> {
  const port = await invoke("plugin:oauth|start");
  return port as number;
}


