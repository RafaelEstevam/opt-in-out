const Term = require("../schemas/termService");
const bcrypt = require('bcrypt');

module.exports = {
    async getLastTerm (req, res){
        let term = await Term.findOne().sort({term_version: -1}).limit(1);
        return res.json(term);
    },

    async post (req, res){

        const {term_name, start_date, term_text} = req.body;

        let salt = bcrypt.genSaltSync(8);
        const hashedText = await bcrypt.hashSync(term_text, salt);

        let lastTermActivate = await Term.findOne().sort({term_version: -1}).limit(1);
        const newTermVersion = lastTermActivate?.term_version ? lastTermActivate?.term_version + 1 : 1;
        let term = await Term.create({term_version: newTermVersion, term_name, term_text: hashedText, start_date});

        term.save();
        return res.json(term);
        
    },

    async validateTerm (req, res){

        const {term_text} = req.body;

        let term = await Term.findOne().sort({term_version: -1}).limit(1);
        await bcrypt.compare(term_text, term.term_text, (e, validated) => {
            return res.json({term, validate_term: validated});
        });

    }
}