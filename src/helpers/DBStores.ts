import {Store} from 'tauri-plugin-store-api';


export const SettingsStore =  new Store('.settings.dat');
export const AuthStore =  new Store('.auth.dat');
export const TaskStore =  new Store('.task.dat');