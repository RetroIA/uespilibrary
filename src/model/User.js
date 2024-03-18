import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    nome: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    senhaCadastro: {
        type: String,
        required: true,
    },
    confirmarSenha: {
        type: String,
    },
    matricula: {
        type: String,
        required: true,
        unique: true,
    },
    curso: {
        type: String,
    },
    moderador: {
        type: Boolean,
        default: false,
    },
});


export default model('User', UserSchema);