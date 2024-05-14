const express = require('express');
const cors = require('cors');
require('./db/config');
const User = require('./db/User')
const Countries = require('./models/Countries')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const path = require('path')
const DataUriParser = require('datauri/parser.js')
const dotenv = require('dotenv')
const cloudinary = require('cloudinary');
const { sendEmail } = require('./utils/sendEmail');

dotenv.config({path: './config/config.env'});


const app = express();

app.use(express.json());
// app.use(cookieParser());
app.use(cors())
app.use(fileUpload())

const PORT = 5000;


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET
})

app.post('/test', async (req, res) => {
    const countryname = 'India'
    const statename = {name: 'Madhya Pradesh', cities: [{name: 'Indore'}]}

    let country = await Countries.create({
        countryname,
        states: statename
    })

    res.send({country: country})
})

// Register API
app.post('/signup', async (req, res) => {
    const {firstName,lastName,gender,email,password,selectedCountry,selectedState,selectedCity,zipCode,checkedItems} = req.body;
    let file = req.files;

    if(file){
        const getDataUri = (file) => {
            const parser = new DataUriParser();
            const extName = path.extname(file.image.name).toString();
            return parser.format(extName, file.image.data);
        }
        
        const fileUri = getDataUri(file);
        file = await cloudinary.v2.uploader.upload(fileUri.content)
        file = file.secure_url
    }
        
        
    let users = await User.find({email})
    users.map((user) => {
        if(user.email == email){
            return res.send({codeStatus: 404, message:'Email Already Exist'})
        } 
    })
       
    let user = await User.create({
        firstName,
        lastName,
        gender,
        email,
        password,
        selectedCountry,
        selectedState,
        selectedCity,
        zipCode,
        checkedItems,
        image: file
    })
    if(user) res.send({status: 200, message: 'User Created'})
})

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    
    if( !email || !password ){
        res.send({status: 400, message: 'Please enter valid credentials'})
    }

    let user = await User.findOne({email: email});

    if(!user){
        return res.send({status: 400, message:'User Doesnt exist'})
    }

    const isMatched = await user.comparePassword(password);
    if(!isMatched){
        return res.send({status: 401, message: 'Incorret Password'})
    }

    if(user){
        res.send({status: 200, message: `Welcome ${user.firstName}`})
    }else{
        res.send({status: 404, message: `User Not Found`})
    }


})

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.send(users)
})

app.get('/user/:_id', async (req, res) => {
    const user = await User.findById(req.params._id);

    if(!user){
        return res.send({status: 400, message: 'User Not Found'})
    }

    res.send({status: 200, data: user});
})

app.delete('/delete/:_id', async (req, res) => {
    const user = await User.findById(req.params._id);
    
    if(!user){
        return res.send({status:400, message: 'User Not Found'})
    }

    await user.deleteOne(user);

    res.status(200).json({
        message: 'User Deleted'
    })
})

app.put('/user/update/:_id', async (req, res) => {
    const {firstName,lastName,gender,password,selectedCountry,selectedState,selectedCity,zipCode,checkedItems} = req.body;
    let file = req.files;


    if(file){
        const getDataUri = (file) => {
            const parser = new DataUriParser();
            const extName = path.extname(file.image.name).toString();
            return parser.format(extName, file.image.data);
        }

        const fileUri = getDataUri(file);
        file = await cloudinary.v2.uploader.upload(fileUri.content)
    }

    const user = await User.findById(req.params._id);
    if(!user){
        return res.send({status:400, message: 'User Not Found'})
    }

    if(firstName) user.firstName = firstName;
    if(lastName) user.lastName = lastName;
    if(gender) user.gender = gender;
    if(password) user.password = password;
    if(selectedCountry) user.selectedCountry = selectedCountry;
    if(selectedState) user.selectedState = selectedState;
    if(selectedCity) user.selectedCity = selectedCity;
    if(zipCode) user.zipCode = zipCode;
    if(checkedItems) user.checkedItems = checkedItems;
    if(file) user.image = file.secure_url;


    await user.save()

    res.status(200).json({
        message: 'Profile Updated'
    })
})

app.post('/reset', async (req, res) => {

    const { email } = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.send({status: 400, message: 'No such user exist'})
    }

    res.send({status: 200, message: 'User exist'})

})

app.post('/resetEmail', async(req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email})
    if(!user){
        return res.send({status: 400, message: 'No such User exist'})

    }
    const url = `http://localhost:5173/resetpassword?user=${user.email}`
    const message = `Please click on the link to reset password, ${url}`
    const success = await sendEmail(user.email, 'Reset Email Link', message)
    console.log(success)
    if(success){
        res.send({status: 200, message: 'Email Sent Successfully'})
    }
})

app.put('/updatepassword/:user', async (req, res) => {
    const { newPassword, currentUser } = req.body;
    let emailUser = req.params.user;
    
    console.log(currentUser, emailUser, 'newuser')

    let newUser;

    if(currentUser){
        newUser = currentUser
    } else if(emailUser){
        newUser = emailUser
    } 

    const user = await User.findOne({'email': newUser});
    if(!user){
        return res.send({status: 400, message: 'Oops!! Something went wrong'})
    }

    if(newPassword) user.password = newPassword;

    await user.save()

    res.send({status: 200, message: 'Password reset Successfully'})
})

app.listen(PORT, () => {    
    console.log(`Server is up and running on Port ${PORT}`)
})