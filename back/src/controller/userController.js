const User = require("../schemas/userService");
const Term = require("../schemas/termService");
const interceptor = require("../utils/interceptor");

const bcrypt = require('bcrypt');

const project_data = {
    recieve_email: 1,
    recieve_sms: 1,
    show_sensitive_data: 1,
    doc: {
        $cond: {
            if: {
                $eq: ["$show_sensitive_data", true]
            },
            "then": "$doc",
            "else": "***"
        }
    },
    name: {
        $cond: {
            if: {
                $eq: ["$show_sensitive_data", true]
            },
            "then": "$name",
            "else": "***"
        }
    },
    email: {
        $cond: {
            if: {
                $eq: ["$show_sensitive_data", true]
            },
            "then": "$email",
            "else": "***"
        }
    },
    phone: {
        $cond: {
            if: {
                $eq: ["$show_sensitive_data", true]
            },
            "then": "$phone",
            "else": "***"
        }
    }
}

module.exports = {
    async post (req, res){
        const {email, password, name, doc, phone, recieve_sms, recieve_email, show_sensitive_data, term_accept, term_accept_version, created_at, updated_at} = req.body;
        let user = await User.findOne({doc});
        let currentTerm = await Term.findOne().sort({term_version: -1}).limit(1)
        let salt = bcrypt.genSaltSync(8);
        const hashedpass = await bcrypt.hashSync(password, salt);
        if(!user){
            user = await User.create({
                email,
                password: hashedpass,
                name,
                phone,
                doc,
                recieve_sms,
                recieve_email,
                show_sensitive_data,
                term_accept,
                term_accept_version: term_accept_version ? currentTerm.term_version : null,
                created_at,
                updated_at
            });

            interceptor(req, res, user);

            user.save();

            return res.json(user);
        }else{
            return res.send("Usuário já cadastrado");
        }
    },

    async put (req, res) {

        const {email, password, name, doc, phone, recieve_sms, recieve_email, show_sensitive_data, term_accept, term_accept_version} = req.body;
        const {id} = req.params;

        let salt = bcrypt.genSaltSync(8);
        const hashedpass = await bcrypt.hashSync(password, salt);

        let user = await User.findById(id);

        if(user){

            const updated_at = new Date();
            await User.findByIdAndUpdate(id, {email, password: hashedpass, name, doc, phone, recieve_sms, recieve_email, show_sensitive_data, term_accept, term_accept_version, updated_at});
            interceptor(req, res, user);

            return res.send("Usuário alterado com sucesso");
        }else{
            return res.send("Usuário não encontrado");
        }

    },

    async get (req, res) {

        const {id} = req.params;

        let user = await User.findById(id, project_data);

        if(user){
            return res.json(user);
        }else{
            return res.send("Usuário não encontrado");
        }
    },

    async getAllUsers(req, res){

        let users = await User.find({}, project_data);
        return res.json(users);
    },

    async getByAcceptServices(req, res){

        const {recieve_email, recieve_sms} = req.body;

        let users = await User.find(
            {
                "$or":[
                    {"$or": [
                        {
                            "recieve_email": {
                                "$eq": recieve_email
                            }
                        }
                    ]},
                    {"$or": [
                        {
                            "recieve_sms": {
                                "$eq": recieve_sms
                            }
                        }
                    ]
                    }
                ]
            },
            {_id: 1, email: 1, phone: 1, recieve_email: 1, recieve_sms: 1}
        );

        return res.json(users);

    }
}