const User = require("../service/userService");
const Term = require("../service/termService");
const interceptor = require("../utils/interceptor");

module.exports = {
    async post (req, res){
        const {email, password, name, doc, recieve_sms, recieve_email, show_sensitive_data, term_accept, term_accept_version, created_at, updated_at} = req.body;
        let user = await User.findOne({doc});
        let currentTerm = await Term.findOne().sort({term_version: -1}).limit(1)

        if(!user){
            user = await User.create({
                email,
                password,
                name,
                doc,
                recieve_sms,
                recieve_email,
                show_sensitive_data,
                term_accept,
                term_accept_version: term_accept ? currentTerm.term_version : null,
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

        const {email, password, name, doc, recieve_sms, recieve_email, show_sensitive_data, term_accept, term_accept_version} = req.body;
        const {id} = req.params;

        let user = await User.findById(id);

        if(user){

            const updated_at = new Date();
            await User.updateOne({id}, {email, password, name, doc, recieve_sms, recieve_email, show_sensitive_data, term_accept, term_accept_version, updated_at});
            interceptor(req, res, user);

            return res.send("Usuário alterado com sucesso");
        }else{
            return res.send("Usuário não encontrado");
        }

    },

    async get (req, res) {

        const {id} = req.params;

        const project_data = {
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
            }
        }

        let user = await User.findById(id, project_data);

        if(user){
            return res.json(user);
        }else{
            return res.send("Usuário não encontrado");
        }

    }
}

// {
//     doc: {
//         $cond: {
//             if: {
//                 $eq: ["$show_sensitive_data", true]
//             },
//             "then": "$doc",
//             "else": "***"
//         }
//     }
// }