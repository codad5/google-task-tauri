import {invoke} from '@tauri-apps/api/tauri';
import { AccessToken } from '../types/googleapis';

export async function save_auth_code(code: string) {
    return await invoke('save_auth_code', {code});
}

export async function get_auth_code() {
    return await invoke('get_auth_code');
}

export async function save_auth_token(token: string|AccessToken) {
    const accessTokenText: string = typeof token === "string" ? token : JSON.stringify(token, null, 2);
    return await invoke('save_auth_token', {token : accessTokenText});
}

export async function get_auth_token() {
    return await invoke('get_auth_token');
}

export async function test_command() {
    return await invoke('test_command');
}

export async function greet(name: string) {
    return await invoke('greet', {name});
}