import type { IDriver } from "./driver.interface";
import type { IUser } from "./user.interface";


export interface AuthRequest extends Request {
    user?: IUser;
    driver?: IDriver;
}

export interface JWTPayload {
    id: string;
    iat?: number;
    exp?: number;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: IUser;
        token: string;
        driverStatus?: string;
        driverApproved?: boolean;
    };
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
        user: IUser;
        token: string;
    };
}