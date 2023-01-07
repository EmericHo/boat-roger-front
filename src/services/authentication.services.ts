import axios from 'axios';
import jwtDecode from 'jwt-decode';
import config from '../config';
import { AuthenticationResponse, AuthenticationClaims } from '../models/authentication.models';
import { AccountResponse } from '../models/account.models';

class AuthenticationService {

    static readonly TOKEN_STORAGE_KEY = `${config.appName?.toLowerCase()}-token`;

    private token?: string;
    private claims?: AuthenticationClaims;

    constructor() {
        const token = localStorage.getItem(AuthenticationService.TOKEN_STORAGE_KEY);

        if (token) {
            this.token = token;
            this.claims = jwtDecode<AuthenticationClaims>(this.token);
        }

        if (!this.isAuthenticated()) {
            this.clear();
        }

        axios.interceptors.request.use((axiosRequestConfig) => {
            if (this.token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
            }

            return axiosRequestConfig;
        });
    }

    async authenticate(userName: string, password: string): Promise<AccountResponse> {
        const { data: authentication } = await axios.post<AuthenticationResponse>(`${config.backendUrl}/auth`, {
            "userName": userName,
            "password": password
        });

        this.token = authentication.accessToken;
        console.log(this.token);
        this.claims = jwtDecode<AuthenticationClaims>(this.token);
        localStorage.setItem(AuthenticationService.TOKEN_STORAGE_KEY, this.token);

        return this.getConnectedUser();
    }

    isAuthenticated() {
        if (!this.token || !this.claims) {
            return false;
        }

        const now = Date.now() / 1000;

        if (this.claims.exp < now) {
            return false;
        }

        return true;
    }

    clear() {
        this.token = undefined;
        this.claims = undefined;
        localStorage.removeItem(AuthenticationService.TOKEN_STORAGE_KEY);
    }

    getConnectedUser(): AccountResponse {
        if (this.claims) {
            return {
                id: this.claims.sub,
                userName: this.claims.userName
            };
        } else {
            return {
                id: '',
                userName: '',
            };
        }
    }

}

export default new AuthenticationService();
