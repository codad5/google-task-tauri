import { invoke } from '@tauri-apps/api/tauri';
import * as commands from './commands';
import { AccessToken, SaveAccessTokenResponse, SaveTokenResponse } from './commands';
import {AuthStore} from './DBStores';
import settings from '../config/settings';


const storeConstant = settings.storage.constants;

export async function save_auth_code(code: string) : Promise<SaveTokenResponse> {
    // return await commands.saveCode(code);
    await AuthStore.set(storeConstant.authcode, code);
    return { message: "Code saved", token: code, success: true };


}

export async function get_auth_code() : Promise<string> {
    // return await commands.loadCode();
    return await AuthStore.get<string>(storeConstant.authcode) ?? "";
    
}

export async function save_access_token(token: string|AccessToken) : Promise<SaveAccessTokenResponse> {
    const accessTokenText: AccessToken = typeof token === "string" ? JSON.parse(token) : token;
    // return await commands.saveAccessToken(accessTokenText);
    await AuthStore.set(storeConstant.access_token, accessTokenText);
    return { message: "Token saved", success: true, token: token as AccessToken };
}

export async function get_access_token() : Promise<AccessToken> {
    // return await commands.loadAccessToken();
    return await AuthStore.get<AccessToken>(storeConstant.access_token) ?? {} as AccessToken;
}

export async function test_command() {
    return await commands.testCommand();
}

export async function greet(name: string) {
    return await commands.greet(name);
}

export async function generate_oauth_port() {
    return await invoke("plugin:oauth|start");
}