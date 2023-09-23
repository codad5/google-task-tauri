export type defaultResponse = {
    success: boolean;
    message: string;
    [key: string]: any;
};

export type saveTokenResponse = {
    success: boolean;
    message: string;
    token: string;
};