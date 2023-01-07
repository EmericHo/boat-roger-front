export interface AccountRequest {
    id?: string;
    password?: string,
    userName?: string,
}

export interface AccountResponse {
    id: string,
    userName: string,
    createdAt?: string;
    updatedAt?: string;}
