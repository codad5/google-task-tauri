import {invoke} from '@tauri-apps/api/tauri';
import { AccessToken } from '../types/googleapis';

export async function save_auth_code(code: string) {
    return await invoke('save_code', {code});
}

export async function get_auth_code() {
    return await invoke('load_code');
}

export async function save_access_token(token: string|AccessToken) {
    const accessTokenText: string = typeof token === "string" ? token : JSON.stringify(token, null, 2);
    return await invoke('save_access_token', {token : accessTokenText});
}

export async function get_access_token() {
    return await invoke<String|string>('load_access_token');
}

export async function test_command() {
    return await invoke('test_command');
}

export async function greet(name: string) {
    return await invoke('greet', {name});
}

export async function generate_oauth_port() {
    return await invoke("plugin:oauth|start");
}