import { generateToken } from "../../lib/generateToken/generateToken.js";
import { User } from "../../model/user/User.js";
import bcrypt, { genSalt } from "bcrypt";
import { AppErr } from "../../utils/AppErr.js";
import { v2 as cloudinary } from 'cloudinary';


const loginCtrl = async (req,res,next) => {
    const {username,password} = req.body;
    try {
        //if fields are empty 
        if(!username || !password) return next("Fields are empty",500);
        //check if user exists
        const foundUser = await User.findOne({username}).select("_id password");
        if(!foundUser) return next(new AppErr("User Not Found",500));
        //check password is exists
        const checkPassword = await bcrypt.compare(password,foundUser.password);
        if (!checkPassword) return next(new AppErr("Password doesnot match",500));

        res.json({
            //set token
            token: generateToken(foundUser._id)
        });

    } catch (error) {
        next(new AppErr(error.message,500));
    }
}


const registerCtrl = async (req,res,next) => {
    const {username,password,email} = req.body;
    try{
        //if user send null field
        if(!username || !email || !password) return next(new AppErr("Fields are empty",500));
        
        //if user already exist
        const findUser = await User.findOne({$or:[{username},{email}]}).select("username email");
        if(findUser) return next(new AppErr("User already exists",500));

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const userCreate = await User.create({
            username,
            email,
            password: hashedPassword
        });
        res.json({ 
            token: generateToken(userCreate._id)
        });
    }
    catch(error){
        next(new AppErr(error.message,500));
    }
}

const allConvoCtrl = async (req,res,next) => {
    try {
        const allConvo = await User.findById(req.user).populate({
            path:"convo",
            populate:{
                path:"senderId"
            }
        }).populate({
            path:"convo",
            populate:{
                path:"receiverId"
            }
        }).select("-password");
        
        res.json(allConvo);
    } catch (error) {
        next(new AppErr(error.message,500));
    }
}


const updatepasswordCtrl = async (req,res,next) => {
    const {password} = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        await User.findByIdAndUpdate(req.user,{password:hashedPassword});
        res.json({msg: "Password updated"});
    } catch (error) {
        next(new AppErr(error.message,500));
    }
}

const searchUser = async (req,res,next) => {
    const {username} = req.body;
    try {
        const authUser = await User.findById(req.user).select("username");
        const findUser = await User.find({username: {$regex: username, $options: 'i'}}).select("username");
        const isPresentAuthUser = findUser.map(e => {
            return (e.username === authUser.username) ? true : false;
        });
        
        if(!findUser || isPresentAuthUser[0]) return next(new AppErr("User Not Found"));
        res.json({data: findUser});

    } catch (error) {
        next(new AppErr(error.message));
    }
}


const formUpdate = async (req,res,next) => {
    const {username,email,password} = req.body;
    try {
        const user={};

        const findUserProfile = await User.findById(req.user);
        
        if(!username && !email && !password && !req.file) return next(new AppErr("Fields are empty"));

        const findUser = await User.find({$and: [ {_id: {$eq: req.user}}, {$or:[{username},{password},{email}]}]});
        
        if(req.file && findUserProfile.profile){
            cloudinary.uploader.destroy(findUserProfile.public_id,{
                type: "authenticated",
                resource_type: "image"
            });
        }

        if(findUser.length !== 0) return next(new AppErr("Fields already exists"));

        
        if(email) {
            user.email = email;
        }
        if(password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            user.password = hashedPassword;
        }
        if(username) {
            user.username = username;
        }
        
        if(req.file) {
            user.profile = req.file.path;
            user.public_id = req.file.filename
        }
        
        await User.findByIdAndUpdate(req.user,{$set: user},{new: true});
        res.json({
            msg: "Image uploaded successfully"
        });
    } catch (error) {
        next(new AppErr(error.message));
    }
}


export { loginCtrl, registerCtrl, allConvoCtrl,updatepasswordCtrl , searchUser,formUpdate}