export interface JWT {
    exp: number,
    iat: number,
    jti: string,
    user_id : number,
    username : string,
    role: "user" | "manager"
}