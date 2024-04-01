import { shell } from "@tauri-apps/api";
import axios from "axios";
import { UserProfile } from "../types/googleapis";
import { readTextFile, removeFile, writeTextFile, exists } from "@tauri-apps/api/fs";
import { CLIENT_ID, CLIENT_SECRET } from "../config/credentials";
import settings from "../config/settings";
import { generate_oauth_port, get_access_token, get_auth_code, save_access_token, save_auth_code } from "./invoker";
import { AccessToken } from "./commands";
import { getRecoil, setRecoil } from "recoil-nexus";
import { accessTokenState, activeCategoryTasksState, activeTaskCategoryState, authLoadingState, messageState, userProfileState } from "../config/states";
import { pushNotification } from "./windowhelper";


const DEFAULT_DIRECTORY = settings.fs.DEFAULT_DIRECTORY;
const GOOGLE_OAUTH_ENDPOINT = settings.auth.GOOGLE_OAUTH_ENDPOINT;
const SCOPE = settings.auth.SCOPE;
const STORAGE_PATHS = settings.storage.paths;
// anonymous class for managing port
class PortManager {
    private port ?: number;
    async getPort() {
        this.port = this.port || await this.generatePort();
        return this.port;
    }
    async generatePort() : Promise<number> {
        const port = await generate_oauth_port();
        return port as number;
    }
}

const portManager = new PortManager();

export async function getAccessToken(code: string) : Promise<AccessToken> {
    try {
        const port = await portManager.getPort();
        const data = {
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: getLocalHostUrl(port),
            grant_type: "authorization_code",
        };
        console.log(data, "data");
        const response = await axios.post("https://oauth2.googleapis.com/token", data);
        console.log(response, "response from getAccessToken");
        return response.data;
    }
    catch (error) {
        console.log(error, "error from getAccessToken");
        throw new Error("Error getting access token");
    }

}

export async function refreshAccessToken(refreshToken: string) : Promise<AccessToken> {
    try {
        const data = {
            refresh_token: refreshToken,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: "refresh_token",
        };
        console.log('attempting to refresh access token', data);
        const response = await axios.post("https://oauth2.googleapis.com/token", data);
        return {...response.data, refresh_token: refreshToken};
    } catch (error) {
        console.error("Error refreshing access token:", error);
        throw new Error("Error refreshing access token");
    }
}

export async function refreshAndSaveAccessToken(refreshToken: string): Promise<AccessToken> {
    try {
        const accessToken = await refreshAccessToken(refreshToken);
        await saveAccessToken(accessToken);
        return accessToken;
    } catch (error) {
        console.error("Error refreshing and saving access token:", error);
        throw new Error("Error refreshing and saving access token");
    }
}

export async function revokeAccessToken(accessToken: string) {
    try {
        const data = {
            token: accessToken,
        };
        const response = await axios.post("https://oauth2.googleapis.com/revoke", data);
        return response.data;
    } catch (error) {
        console.error("Error revoking access token:", error);
        throw new Error("Error revoking access token");
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
    const url = new URL(GOOGLE_OAUTH_ENDPOINT);
    url.searchParams.append("scope", SCOPE);
    url.searchParams.append("access_type", "offline");
    url.searchParams.append("response_type", "code");
    url.searchParams.append("client_id", CLIENT_ID);
    url.searchParams.append("redirect_uri", getLocalHostUrl(await portManager.getPort()));
    url.searchParams.append("include_granted_scopes", "true");
    url.searchParams.append("state", "state_parameter_passthrough_value");
    shell.open(url.href);
}

// save the auth code to storage
export async function saveAuthCode(code: string) {
    try {
        return await save_auth_code(code);
    } catch (error) {
        console.error("Error saving auth code:", error);
        throw new Error("Error saving auth code");
    }
}

// get the auth code from storage
export async function getAuthCode() {
    try {
        return await get_auth_code();
    } catch (error) {
        console.error("Error getting auth code:", error);
        return null;
    }
}

export async function saveAccessToken(accessToken: string|AccessToken) {
    try {
        localStorage.setItem("lastLogin", Date.now() + "");
        return await save_access_token(accessToken);
    } catch (error) {
        console.error("Error saving access token:", error);
        localStorage.removeItem("lastLogin");
        throw new Error("Error saving access token");
    }
}



export async function getAccessTokenFromStorage() {
    try {
        let accessToken = await get_access_token();
        console.log('new access token found')
        // check if the access token is expired
        console.log(accessToken, "accessToken");
        const lastLogin = parseInt(localStorage.getItem("lastLogin") || "0");
        if ((accessToken.expires_in < Date.now() || Date.now() - lastLogin > 3620) && navigator.onLine){
            console.log("Access token expired");
            accessToken = await refreshAndSaveAccessToken(accessToken.refresh_token);
        }
        return accessToken;
    } catch (error) {
        console.error("Error getting access token:", error);
        return null;
    }
}


export async function deleteAccessToken() {
    try {
        return await removeFile(STORAGE_PATHS.access_token, { dir: DEFAULT_DIRECTORY });
    } catch (error) {
        console.error("Error deleting access token:", error);
        throw new Error("Error deleting access token");
    }
}

export async function saveUserProfile(userProfile: UserProfile) {
    try {
        return await writeTextFile(STORAGE_PATHS.user_profile, JSON.stringify(userProfile), { dir: DEFAULT_DIRECTORY });
    } catch (error) {
        console.error("Error saving user profile:", error);
        throw new Error("Error saving user profile");
    }
}

export async function getUserProfileFromStorage() {
    try {
        const userProfile = await readTextFile(STORAGE_PATHS.user_profile, { dir: DEFAULT_DIRECTORY });
        return JSON.parse(userProfile) as UserProfile;
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
}


export async function handleLogin() {
    setRecoil(authLoadingState, true)
    try {
      const storedAccessToken = await getAccessTokenFromStorage();
      if (storedAccessToken) {
        handleLoadFrom(storedAccessToken);
        pushNotification('Login Successful')
        return;
      }
      pushNotification('login required')
      await openAuthWindow();
    } catch (error) {
      console.log(error);
      setRecoil(authLoadingState, false)
      setRecoil(messageState, {
        title: "Error",
        body: "Error signing in",
        type: "error"
      })
    }
}
  

export async function handleLoadFrom(accessTokenBody: AccessToken) {
    try {
      await saveAccessToken(JSON.stringify(accessTokenBody, null, 2))
      setRecoil(accessTokenState, accessTokenBody.access_token);
        //   setAccessToken(accessTokenBody.access_token);
      const userProfile = await fetchUserProfile(accessTokenBody.access_token);
      await saveUserProfile(userProfile)
      setRecoil(userProfileState, userProfile);
    }
    catch (err) {
      console.log(err);
      setRecoil(authLoadingState, false)
      await handleLogout();
      setRecoil(messageState, {
        title: "Error",
        body: "Error signing in",
        type: "error"
      })
    }
}
  
export async function handleLogout() {
    setRecoil(authLoadingState, true)
    setRecoil(accessTokenState, null);
    // setAccessToken(null);
    setRecoil(userProfileState, null);
    // setProfile(null);
    // setActiveTaskCategory(-1)
    setRecoil(activeTaskCategoryState, -1)
    // setActiveCategoryTasksState([])
    setRecoil(activeCategoryTasksState, [])
    await deleteAccessToken();
    setRecoil(authLoadingState, false)
  }


export async function handleInitialLogin() {
    // get access token from storage
    const accessToken = await getAccessTokenFromStorage();
    if (!accessToken) throw new Error("Signin required");
    pushNotification("Login Successful")
    const profile = navigator.onLine ? await fetchUserProfile(accessToken.access_token) : await getUserProfileFromStorage();
    if(!profile || !profile?.email) throw new Error("Something went wrong, please try again");
    // setProfile(profile);
    setRecoil(userProfileState, profile);
    // setAccessToken(accessToken.access_token);
    setRecoil(accessTokenState, accessToken.access_token);
    pushNotification(`welcome back ${profile.name}`)
  }





function getLocalHostUrl(port: number) {
  return `http://localhost:${port}`;
}




