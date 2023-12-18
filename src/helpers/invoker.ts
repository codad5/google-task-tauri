import { invoke } from '@tauri-apps/api/tauri';
import * as commands from './commands';
import { AccessToken } from './commands';

export async function save_auth_code(code: string) {
    return await commands.saveCode(code);
}

export async function get_auth_code() {
    return await commands.loadCode();
}

export async function save_access_token(token: string|AccessToken) {
    const accessTokenText: string = typeof token === "string" ? token : JSON.stringify(token, null, 2);
    return await commands.saveAccessToken(accessTokenText);
}

export async function get_access_token() {
    return await commands.loadAccessToken();
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