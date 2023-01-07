import axios from 'axios';

import { AccountResponse, AccountRequest } from "../models/account.models";
import config from '../config';

class AccountService {

    async createAccount(request: AccountRequest) : Promise<AccountResponse> {
        const { data : account} = await axios.post<AccountResponse>(`${config.backendUrl}/account`, request);
        return account;
    }

}

export default new AccountService();
