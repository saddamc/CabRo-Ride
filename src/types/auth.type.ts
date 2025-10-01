export interface ISendOtp {
    email: string,
}
export interface IVerifyOtp {
    email: string,
    otp: string,
}

export interface ILogin {
    email: string,
    password: string
}

export interface IUser {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    emergencyContact?: string;
    status?: string;
    isOnline?: boolean;
    createdAt?: string;
    role?: string;
}

