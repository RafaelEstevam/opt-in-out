const User = require("../service/userService");
const Term = require("../service/termService");

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
            user.save();
            return res.json(user);
        }else{
            return res.send("Usuário já cadastrado");
        }
    }
}