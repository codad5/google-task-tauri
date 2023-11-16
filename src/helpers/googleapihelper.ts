import { readTextFile } from "@tauri-apps/api/fs";
import settings from "../config/settings";
import { AccessToken, GoogleServices } from "../types/googleapis";
import axios, { AxiosInstance } from "axios";


const STORAGE_PATHS = settings.storage.paths;
const DEFAULT_DIRECTORY = settings.fs.DEFAULT_DIRECTORY;

class _GoogleApiHelper {
    private axiosInstance: AxiosInstance;
    private BASE_URL: `https://${GoogleServices}.googleapis.com/${string}`;

    private constructor(googleservice: `${GoogleServices}.googleapis.com/${string}` | GoogleServices, path?: string) {
        const domain: GoogleServices = (googleservice.includes("googleapis.com") ? googleservice.split(".")[0] : googleservice) as GoogleServices;
        const _path = googleservice.includes("googleapis.com") ? googleservice.split("/").slice(1).join("/") : path;
        this.BASE_URL = `https://${domain}.googleapis.com/${_path}`;
        this.axiosInstance = axios.create({
            baseURL: this.BASE_URL,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    static new(googleservice: `${GoogleServices}.googleapis.com/${string}` | GoogleServices, path?: string) {
        return new _GoogleApiHelper(googleservice, path);
    }
    
    async accessToken(): Promise<AccessToken> {
        const accessTokenText = await readTextFile(STORAGE_PATHS.access_token, { dir: DEFAULT_DIRECTORY });
        return JSON.parse(accessTokenText) as AccessToken;
    }

    async get(path: string, params?: any) {
        return this.axiosInstance.get(path, {
            params,
        });
    }

    async post(path: string, data: any) {
        return this.axiosInstance.post(path, data);
    }

    async put(path: string, data: any) {
        return this.axiosInstance.put(path, data);
    }

    async delete(path: string) {
        return this.axiosInstance.delete(path);
    }

    async patch(path: string, data: any) {
        return this.axiosInstance.patch(path, data);
    }

    async head(path: string) {
        return this.axiosInstance.head(path);
    }


    setHeader(key: string, value: string) {
        this.axiosInstance.defaults.headers[key] = value;
    }

}

const GoogleApiHelper = _GoogleApiHelper.new;

export default GoogleApiHelper;