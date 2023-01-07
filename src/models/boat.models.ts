export interface BoatRequest {
    name?: string;
    description?: string;
    manufacturer?: string;
    year?: number;
}

export interface BoatResponse {
    id?: string;
    name?: string;
    description?: string;
    manufacturer?: string;
    year?: number;
    createdAt?: string;
    updatedAt?: string;
}
