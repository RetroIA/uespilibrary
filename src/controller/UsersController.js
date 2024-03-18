import User from "../model/User";
import bcrypt from 'bcryptjs';

class crudUser {

    async store(req, res) {

        console.log("Senha do cadastro:", req.body.senhaCadastro);
        const senhaCadastroCriptografada = bcrypt.hashSync(req.body.senhaCadastro, 8);
        console.log("Senha do cadastro:", req.body.senhaCadastro);

        try {
            const {
                nome,
                email,
                senhaCadastro,
                confirmarSenha,
                matricula,
                curso,
            } = req.body;

            if (senhaCadastro !== confirmarSenha) {
                return res.status(400).json({ error: 'As senhas não correspondem' });
            }

            let usernameExists = await User.findOne({ nome });
            if (usernameExists) {
                return res.status(400).json({ error: 'Um usuário com este nome de usuário já existe' });
            } nome

            let emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ error: 'Um usuário com este email já existe' });
            }

            let userCadastra = await User.create({
                nome,
                email,
                senhaCadastro: senhaCadastroCriptografada,
                matricula,
                curso,
            });

            return res.json({ userCadastra });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ocorreu um erro ao tentar criar o usuário' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const {
                nome,
                email,
                senha,
                matricula,
                curso,
            } = req.body;

            let user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            user.nome = nome;
            user.email = email;
            user.senha = bcrypt.hashSync(senha, 8);
            user.matricula = matricula;
            user.curso = curso;

            await user.save();

            return res.json({ message: 'Dados do usuário atualizados com sucesso' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ocorreu um erro ao tentar atualizar o usuário' });
        }
    }


    async show(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            return res.json(user);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar usuário' });
        }
    }


    async showAll(req, res) {
        let users = await User.find()
        return res.json(users)
    }


    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.json({ error: 'ID é requisito' });
            }

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const deletedUser = await User.findByIdAndDelete(id);

            req.session.destroy(function (err) {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'Erro ao excluir usuário' });
                } else {
                    return res.json({ message: 'Usuário foi deletado com sucesso!' });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ocorreu um erro ao tentar excluir o usuário' });
        }
    }



    async login(req, res) {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Email não encontrado' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.senhaCadastro);
        if (!passwordIsValid) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        if (passwordIsValid) {
            req.session.userId = user._id;
            return res.json(user);
        }

    }

    async logout(req, res) {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/login');
            }
        });
    }

    //Para ver se o usuario está logado
    async checkLogin(req, res) {
        if (req.session && req.session.userId) {
            res.json({ loggedIn: true, id: req.session.userId });
        } else {
            res.json({ loggedIn: false });
        }
    }


    async checkModerador(req, res) {
        if (req.session && req.session.userId) {
            const user = await User.findById(req.session.userId);
            if (user && user.moderador) {
                res.json({ moderador: true, id: req.session.userId });
            } else {
                res.json({ moderador: false });
            }
        } else {
            res.json({ loggedIn: false });
        }
    }

    async tornarModerador(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            user.moderador = true;
            await user.save();

            res.json({ message: 'Usuário atualizado para moderador' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao atualizar o usuário' });
        }
    }


}


export default new crudUser()