import { medical } from "./medical";

let medicalInstance = new medical();

if (typeof window !== "undefined") { 
    medicalInstance = new medical({
        BASE: "localhost:8080",
        WITH_CREDENTIALS: false,
        CREDENTIALS: "include",
        TOKEN: localStorage.getItem("token") || undefined,
    })
}

export default medicalInstance;