import axios, { AxiosHeaders } from 'axios';
import { BoatResponse, BoatRequest } from "../models/boat.models";
import config from '../config';

class BoatService {

    static readonly TOKEN_STORAGE_KEY = `${config.appName?.toLowerCase()}-token`;

    async createBoat(request: BoatRequest): Promise<BoatResponse> {
        const token: string = localStorage.getItem(BoatService.TOKEN_STORAGE_KEY)!;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        const { data: boat } = await axios.post<BoatResponse>(`${config.backendUrl}/boats`,
            request, { headers: headers });
        return boat;
    }

    async updateBoat(id: string, request: BoatRequest): Promise<BoatResponse> {
        const token: string = localStorage.getItem(BoatService.TOKEN_STORAGE_KEY)!;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        const { data: boat } = await axios.patch<BoatResponse>(`${config.backendUrl}/boats/` + id, request, { headers: headers });
        return boat;
    }

    async deleteBoat(id: string) {
        const token: string = localStorage.getItem(BoatService.TOKEN_STORAGE_KEY)!;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        await axios.delete<BoatResponse>(`${config.backendUrl}/boats/` + id, { headers: headers });
    }

    async getBoats(): Promise<BoatResponse[]> {
        const token: string = localStorage.getItem(BoatService.TOKEN_STORAGE_KEY)!;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        const { data: account } = await axios.get<BoatResponse[]>(`${config.backendUrl}/boats`, { headers: headers });
        return account;
    }

}

export default new BoatService();
