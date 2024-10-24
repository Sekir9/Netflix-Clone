import { User } from '../models/user.model.js';

export async function signup(req, res){
  try {

    const {email, password, username} = req.body;

    if(!email || !password ||!username) {
      return res.status(400).json({success:false, message: "All fields are required"});
    }
    
    const emailRegex = /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i

    if(!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email"
      });
    }

    if(password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      })
    }

    const existingUserByEmail = await User.findOne({email: email});

    if(existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const existingUserByUsername = await User.findOne({username: username})

    if(existingUserByUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already exists"
      })
    }

    const PROFILE_PICS = ["/avatar.png", "/avatar2.png", "/avatar3.png"];

    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = new User({
      email,
      password,
      username,
      image
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      user: {
        ...newUser._doc,
        password:""
      }
    });

  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export async function login(req, res){
  res.send("Login route");
}

export async function logout(req, res){
  res.send("Logout route");
}