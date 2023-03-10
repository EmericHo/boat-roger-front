export interface AuthenticationResponse { 
    accessToken: string;
}

export interface AuthenticationClaims {
    iat: number;
    exp: number;
    sub: string;
    userName: string;
}
