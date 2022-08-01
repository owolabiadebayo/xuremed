import signin from "../model/signin/signin";
import signup from "../model/signup/signup";
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")


export const login = async (req, res) => {
    //validate the data
    // const error = signinValidation(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    //check if user already exists
    const confrimedUser = await signup.findOne({email:req.body.email});
    console.log(confrimedUser);
    if (!confrimedUser) return res.status(400).send('Email is wrong');

    //check if password is wrong
    const confrimedPassword = await bcrypt.compare(req.body.password, confrimedUser.password);
    if(!confrimedPassword) return res.status(400).send('wrong password');

    //create and assign a token
    const token = jwt.sign({ _id: confrimedUser._id }, process.env.TOKEN_SECRET, {
        expiresIn:"7d",
    });
    console.log(token);
    res.header("auth-token", token).send(token);
    
    const { email, password } = req.body;
    console.log(email, password);
    const loggerdata = new signin({
        email:req.body.email,
        password: req.body.password,
    });
    console.log(loggerdata);
    try {
        await loggerdata.save();
        res.send({
            user: loggerdata._id,
        });
    } catch (err) {
        res.status(400).send(err);
    }
};