var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');
const nodemailer = require('nodemailer');
const archiver = require('archiver');

var FacultyModel = require('../models/FacultyModel');
var UserModel = require('../models/UserModel');
var MarketingCoordinatorModel = require('../models/MarketingCoordinatorModel');
var EventModel = require('../models/EventModel');
var StudentModel = require('../models/StudentModel');
var ContributionModel = require('../models/ContributionModel');
 
const {checkAdminSession, checkStudentSession, verifyToken} = require('../middlewares/auth');
//------------------------------------------------
//import "bcryptjs" library
var bcrypt = require('bcryptjs');
const NotificationMCModel = require('../models/NotificationMCModel');
const { fail } = require('assert');
const { error } = require('console');
var salt = 8;                     //random value

//----------------------------------Phần này cho Role Admin---------------------------------------
// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/') // Set the destination folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()) // Set the filename to avoid name conflicts
    }
});

const upload = multer({ storage: storage });


//------------------------------------------------------------------------
//show all 
router.get('/', verifyToken, async(req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            var studentList = await StudentModel.find({}).populate('user').populate('faculty');
            res.status(200).json({ success: true, data: studentList });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    }catch(error){
        console.error("Error while fetching MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific student
router.delete('/delete/:id', verifyToken, async(req, res) => {
    //req.params: get value by url
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            const studentId = req.params.id;
            const student = await StudentModel.findById(studentId);
            if (!student) {
                res.status(404).json({ success: false, error: "Student not found" });
                return;
            }
            // Fetch user details by ID
            const userId = student.user;
            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ success: false, error: "User not found" });
                return;
            }
            await StudentModel.findByIdAndDelete(studentId);
            await UserModel.findByIdAndDelete(userId);
    
            res.status(200).json({ success: true, message: "Delete student and user success" });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    }catch(error){
        console.error("Error while deleting MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create student
//render form for user to input
router.get('/add', verifyToken, async (req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            var facultyList = await FacultyModel.find({});
            res.status(200).json({ success: true, message: "Render student success", data: facultyList });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //------------------------------------------------- 
    }catch(error){
        console.error("Error while adding MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/add', verifyToken, async (req, res) => {
    //get value by form : req.body
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            const name = req.body.name;
            const dob = req.body.dob;
            const gender = req.body.gender;
            const address = req.body.address;
            const faculty = req.body.faculty;
            const image = req.body.image;
    
            const email = req.body.email;
            const password = req.body.password;
            const hashPassword = bcrypt.hashSync(password, salt);
            const role = '65e61d9bb8171b6e90f92da6'; //objectID
          
            const availableUser = await UserModel.findOne({email: email})
            if(availableUser){
                res.status(500).json({success: false, error: "User is available"});
            } else {
                const users = await UserModel.create(
                    {
                        email: email,
                        password: hashPassword,
                        role: role
                    }
                );
                const newStudent = await StudentModel.create(
                                        {
                                            name: name,
                                            dob: dob,
                                            gender: gender,
                                            address: address,
                                            image: image,
                                            faculty: faculty,
                                            user: users
                                        }
                                    );
                if(newStudent){
                    res.status(200).json({ success: true, message: "New student is created" });
                } else {
                    res.status(500).json({success: false, error: "Fail in create new student"});
                }
            }
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
        
    } catch (error) {
        if (error.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in error.errors) {
              InputErrors[field] = error.errors[field].message;
           }
            console.error("Error while creating student:", error);
            res.status(500).json({ success: false, error: "Internal Server Error", InputErrors });
        }
     }
    
});

//---------------------------------------------------------------------------
//edit student
// Render form for editing a specific student
router.get('/edit/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            // Fetch student details by ID
            const studentId = req.params.id;
            const student = await StudentModel.findById(studentId).populate('faculty');
            if (!student) {
                res.status(404).json({ success: false, error: "Student not found" });
                return;
            }
            const facultyList = await FacultyModel.find({});
            // Fetch user details by ID
            const userId = student.user;
            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ success: false, error: "User not found" });
                return;
            }
            res.status(200).json({ success: true, student, user, facultyList });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
        
    } catch (error) {
        // Handle errors (e.g., student not found)
        console.error(error);
        res.status(404).send('Student not found');
    }
});

// Handle form submission for editing a student
router.put('/edit/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây--------------------------
            // Fetch student by ID
            const studentId = req.params.id;
            const student = await StudentModel.findById(studentId);
            if (!student) {
                res.status(404).json({ success: false, error: "Student not found" });
                return;
            }
            // Fetch user details by ID
            const userId = student.user;
            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({ success: false, error: "User not found" });
                return;
            }

            // Update student details
            student.name = req.body.name;
            student.dob = req.body.dob;
            student.gender = req.body.gender;
            student.address = req.body.address;
            student.faculty = req.body.faculty;
            student.image = req.body.image;  
            
            const editStudent = await student.save();
            if(editStudent){
                res.status(200).json({success: true, message: "Edit student success"});
            } else {
                res.status(500).json({success: false, error: "Edit student false"});
            }
            
            user.email = req.body.email;
            user.password = bcrypt.hashSync(req.body.password, salt);
            const editUser = await user.save();
            if(editUser){
                res.status(200).json({success: true, message: "Edit User success"});
            } else {
                res.status(500).json({success: false, message: "Edit User false"});
            }

            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
        
    } catch (error) {
        if (error.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in error.errors) {
              InputErrors[field] = error.errors[field].message;
           }
            console.error("Error while updating student:", error);
            res.status(500).json({ success: false, error: "Internal Server Error", InputErrors });
        }
     }
});

//-----------------Phần này cho role Student-----------------------------------------------
//trang chủ của Student
router.get('/studentpage', verifyToken, async (req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da6'){
            //Code ở đây--------------------------
            var stUserId = req.userId;
            var UserData = await UserModel.findById(stUserId);
            var STData = await StudentModel.findOne({user: stUserId});
            if(UserData && STData){
                var facultyID = STData.faculty;
            } else {
                res.status(401).json({ success: false, error: "ST not found" });
            }
            var facultyData = await FacultyModel.findOne({_id: facultyID});
            if(!facultyData){
                res.status(400).json({success: false, error: "Not found faculty data"})
            }
            res.status(200).json({ success: true, message: "Found Student page", data: facultyData });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    }catch(error){
        console.error("Error while fetching ST:", error);
        res.status(500).send("Internal Server Error");
    }
});

//đọc thông tin của Student----------------------------------
router.get('/profile', verifyToken, async (req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da6'){
            //Code ở đây--------------------------
            var stUserId = req.userId;
            var UserData = await UserModel.findById(stUserId);
            if(UserData){
                var STData = await StudentModel.findOne({user: stUserId});
            } else {
                req.status(400).send('Student not found');
            }
                res.status(200).json({UserData, STData});
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
        
    }catch(error){
        console.error("Error while fetching student:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----sửa thông tin của Student--------------------------------
router.get('/editST/:id', verifyToken, async (req, res) => {
    const studentId = req.params.id;
    const studentData = await StudentModel.findById(studentId);
    if (!studentData) {
        res.status(404).json({ success: false, error: "Student not found" });
        return;
    }
    // Fetch user details by ID
    const userId = studentData.user;
    const user = await UserModel.findById(userId);
    if (!user) {
        res.status(404).json({ success: false, error: "User not found" });
        return;
    }
    const stUserId = req.userId;
    if(userId.equals(stUserId)){
        try {
            const userId = req.userId;
            const userData = await UserModel.findById(userId);
            if(!userData){
                return res.status(400).json({success: false, error: "Not found user"});
            }
            const userRole = userData.role.toString();
            if(userRole === '65e61d9bb8171b6e90f92da6'){
                //Code ở đây--------------------------
                res.status(200).json({ success: true, studentData, user });
                //----------------------------------
            } else {
                return res.status(400).json({ success: false, error: "Not right Role" });
            }
            //-------------------------------------------------
        } catch (error) {
            // Handle errors (e.g., marketingcoordinator not found)
            console.error(error);
            res.status(404).send('Student not found');
        }
    } else {
        res.status(404).send('Student not found');
    }
    
});

router.put('/editST/:id', verifyToken, async (req, res) => {
    const studentID = req.params.id;
    const studentData = await StudentModel.findById(studentID);
    if (!studentData) {
        res.status(404).json({ success: false, error: "Student not found" });
        return;
    }
    // Fetch user details by ID
    const userId = studentData.user;
    const user = await UserModel.findById(userId);
    if (!user) {
        res.status(404).json({ success: false, error: "Student not found" });
        return;
    }
    const stUserId = req.userId;
    if(userId.equals(stUserId)){
        try {
            const userId = req.userId;
            const userData = await UserModel.findById(userId);
            if(!userData){
                return res.status(400).json({success: false, error: "Not found user"});
            }
            const userRole = userData.role.toString();
            if(userRole === '65e61d9bb8171b6e90f92da6'){
                //Code ở đây--------------------------
                // Update marketingcoordinator details
                studentData.name = req.body.name;
                studentData.dob = req.body.dob;
                studentData.gender = req.body.gender;
                studentData.address = req.body.address;
                studentData.image =  req.body.image;
                 
                await studentData.save();
                
                user.password = bcrypt.hashSync(req.body.password, salt);
                await user.save();
        
                res.status(200).json({ success: true, message: "Student updated successfully" });
                //----------------------------------
            } else {
                return res.status(400).json({ success: false, error: "Not right Role" });
            }
            //-------------------------------------------------
            
        } catch (error) {
            if (error.name === 'ValidationError') {
               let InputErrors = {};
               for (let field in error.errors) {
                  InputErrors[field] = error.errors[field].message;
               }
                console.error("Error while updating student:", error);
                res.status(500).json({ success: false, error: "Internal Server Error", InputErrors });
            }
         }
    } else {
        res.status(404).send('Student not found');
    }
});

//-----------------------------lấy thông tin của faculty----------------------------
router.get('/facultypage', verifyToken, async(req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da6'){
            //Code ở đây--------------------------
            var stUserId = req.userId;
            var UserData = await UserModel.findById(stUserId);
            var STData = await StudentModel.findOne({user: stUserId});
            if(UserData && STData){
                var facultyID = STData.faculty;
            } else {
                res.status(401).json({ success: false, error: "MC not found" });
            }
    
            var facultyData = await FacultyModel.findOne({_id: facultyID});
            if(facultyData){
                var eventData = await EventModel.find({faculty: facultyID});
                res.status(200).json({ success: true, facultyData, eventData  });
            } else {
                res.status(401).json({ success: false, error: "Faculty not found" });
            }
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
    }catch(error){
        console.error("Error while fetching faculty list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------nộp bài trong event ----------------------------------------------
router.get('/submitContribution/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da6'){
            //Code ở đây--------------------------
            // Fetch contribution details by ID
            const eventId = req.params.id;
            const eventData = await EventModel.findById(eventId);
            if (!eventData) {
                res.status(404).json({ success: false, error: "Event not found" });
                return;
            }

            const eventFacultyID = eventData.faculty;

            const STData = await StudentModel.findOne({user: userId});
            const facultyID = STData.faculty;

            if(facultyID.equals(eventFacultyID)){
                res.status(200).json({ success: true, message: "Found Event", data: eventData });
            } else {
                res.status(500).send("Event Faculty not matched")
            }
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
        
    } catch (error) {
        console.error(error);
        res.status(404).send('Event not found');
    }
});

router.post('/submitContribution/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da6'){
            //Code ở đây--------------------------
            const eventId = req.params.id;
            const eventData = await EventModel.findById(eventId);
            const eventFacultyID = eventData.faculty;

            const STData = await StudentModel.findOne({user: userId});
            const facultyID = STData.faculty;
            const stID = STData._id;

            if (facultyID.equals(eventFacultyID)) {
                if (eventData) {
                    const student = stID;
                    const choosen = 'No';
                    const comment = 'Nothing';
                    const date = Date.now();
                    const event = eventId;
                    const filetype = req.body.filetype; //đoạn này cần chọn file type
                    const contribution = req.body.contribution;

                    const status = 'Submit new';

                    const deadline1 = eventData.deadline1;
                    const eventDeadline1 = new Date(deadline1);

                    if (date <= eventDeadline1.getTime()) {
                        const contributionID = await ContributionModel.create({
                            student: student,
                            choosen: choosen,
                            comment: comment,
                            date: date,
                            event: event,
                            contribution: contribution,
                            filetype: filetype
                        });

                        await NotificationMCModel.create({
                            student: student,
                            contribution: contributionID,
                            event: event,
                            faculty: eventFacultyID,
                            date: date,
                            status: status
                        });

                        // Find all marketing coordinators for the event's faculty
                        const marketingCoordinators = await MarketingCoordinatorModel.find({ faculty: eventFacultyID });

                        // Create transporter
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.EMAIL_GMAIL,
                                pass: process.env.PASSWORD_GMAIL
                            }
                        });

                        // Send email to each marketing coordinator
                        for (const mc of marketingCoordinators) {
                            try {
                                const userId = mc.user;
                                const userData = await UserModel.findById(userId);
                                if (userData) {
                                    const userEmail = userData.email;

                                    // Compose email
                                    const mailOptions = {
                                        from: 'projectsystemcomp1640@gmail.com',
                                        to: userEmail,
                                        subject: 'New Contribution Submitted',
                                        text: `A new contribution has been submitted by a student in your faculty's event. Please check the portal for details.`
                                    };

                                    // Send email
                                    await transporter.sendMail(mailOptions);

                                    console.log(`Email sent to ${userEmail}`);
                                } else {
                                    console.error(`User data not found for marketing coordinator ${mc._id}`);
                                }
                            } catch (error) {
                                console.error(`Error sending email to marketing coordinator ${mc._id}:`, error);
                            }
                        }

                        res.status(200).json({ success: true, message: "Submit new document success" });
                    } else {
                        res.status(400).send("Deadline 1 for this event has passed. You cannot submit new documents.");
                    }
                } else {
                    res.status(404).json({ success: false, error: "Event not found" });
                    return;
                }
            } else {
                res.status(500).send("Event Faculty not matched");
                console.log({ facultyID });
                console.log({ eventFacultyID });
            }
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
        
    } catch (err) {
        if (err.name === 'ValidationError') {
            let InputErrors = {};
            for (let field in err.errors) {
                InputErrors[field] = err.errors[field].message;
            }
            console.error("Error in submitting contribution:", err);
            res.status(500).send("Internal Server Error", InputErrors);
        } 
    }
});

//----------xem bài đã submit trong event----------------------------------------------
router.get('/eventDetail/:id', verifyToken, async (req, res) => { 
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da6'){
            //Code ở đây--------------------------
            var eventId = req.params.id;
            const eventData = await EventModel.findById(eventId);
            var eventFacultyID = eventData.faculty;
    
            const STData = await StudentModel.findOne({user: userId});
            var facultyID = STData.faculty;
            const stID = STData._id;
    
            if(facultyID.equals(eventFacultyID) ){
                if (eventData){
                    const contributionList = await ContributionModel.find({event: eventId} && {student: stID});
                    if (contributionList){
                        res.status(201).json({ success: true, eventData, contributionList, STData });
                    } else {
                        res.status(404).json({ success: false, error: "Contribution not found" });
                        return;
                    }
               } else {
                    res.status(404).json({ success: false, error: "Event not found" });
                    return;
               }
            } else {
                res.status(500).send("Event Faculty not matched");
                console.log({facultyID});
                console.log({eventFacultyID});
            }
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
        
    }catch(error){
        console.error("Error while fetching faculty list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-------------------------Delete contribution hiện có trong event-------------------------------------
router.delete('/deleteContribution/:id', verifyToken, async(req, res) => {
    try{
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da6'){
            //Code ở đây--------------------------
            const studentData = await StudentModel.findOne({user: userId});
            if(!studentData){
                return res.status(400).json({success: false, error: "Not found Student"});
            }
            const contributionId = req.params.id;
            const contribution = await ContributionModel.findById(contributionId);
            if (!contribution) {
                res.status(404).json({ success: false, error: "Contribution not found" });
                return;
            }
            const studentID = studentData._id;
            const eventID = contribution.event;
            const eventData = await EventModel.findById(eventID);
            const facultyID = eventData.faculty;
            const date = Date.now();
            const status = 'Delete'; 
    
            const deadline1 = eventData.deadline1;
    
            if(date <= deadline1.getTime()){
                const notiMC = await NotificationMCModel.create({
                    student: studentID,
                    contribution: contributionId,
                    event: eventID,
                    faculty: facultyID,
                    date: date,
                    status: status
                });
    
                // Sending email to marketing coordinator
                const marketingCoordinators = await MarketingCoordinatorModel.find({ faculty: facultyID });
                if (marketingCoordinators) {
                    marketingCoordinators.forEach(async (mc) => {
                        try {
                            const userId = mc.user;
                            const userData = await UserModel.findById(userId);
                            if (userData) {
                                const userEmail = userData.email;
                                const transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                        user: process.env.EMAIL_GMAIL,
                                        pass: process.env.PASSWORD_GMAIL
                                    }
                                });
                                const mailOptions = {
                                    from: 'projectsystemcomp1640@gmail.com', 
                                    to: userEmail,
                                    subject: 'Contribution Deleted',
                                    text: `A contribution has been deleted by a student in your faculty's event. Please check the portal for details.`
                                };
                                await transporter.sendMail(mailOptions);
                                console.log(`Email sent to ${userEmail}`);
                            } else {
                                console.error(`User not found for marketing coordinator ${mc._id}`);
                            }
                        } catch (error) {
                            console.error('Error sending email to marketing coordinator:', error);
                        }
                    });
                } else {
                    console.error('No marketing coordinators found for faculty:', facultyID);
                }
    
                if(notiMC){
                    await ContributionModel.findByIdAndDelete(contributionId);
                    res.status(200).json({ success: true, message: "Contribution is deleted" });
                }
            } else {
                res.status(400).json("Deadline 1 for this event has passed. You cannot submit new documents.");
            }
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
        
    }catch(error){
        console.error("Error while deleting MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-------------------------edit contribution hiện có trong event ----------------------------------------------------
router.get('/editContribution/:id', verifyToken, async(req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da6'){
            //Code ở đây--------------------------
            // Fetch contribution details by ID
            const contributionId = req.params.id;
            const contribution = await ContributionModel.findById(contributionId).populate('event');
            if (!contribution) {
                res.status(404).json({ success: false, error: "Contribution not found" });
                return;
            }
            const stID2 = contribution.student;

            const STData = await StudentModel.findOne({user: userId});
            if(!STData){
                return res.status(400).json({success: false, error: "Not found Student"});
            }
            const facultyID = STData.faculty;
            const studentId = STData._id;

            const eventID = contribution.event;
            const eventData = await EventModel.findById(eventID);
            if(!eventData){
                return res.status(400).json({success: false, error: "Not found Event"});
            }
            const eventFacultyID = eventData.faculty;

            if(facultyID.equals(eventFacultyID) && stID2.equals(studentId)){
                res.status(200).json({ success: true, message: "Found contribution", data: contribution });
            } else {
                res.status(500).send("Event Faculty not matched")
            }
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
        
    } catch (error) {
        // Handle errors (e.g., contribution not found)
        console.error(error);
        res.status(404).send('Contribution not found');
    }
});

router.put('/editContribution/:id', verifyToken, async(req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da6'){
            //Code ở đây--------------------------
            const contributionId = req.params.id;
            const contribution = await ContributionModel.findById(contributionId).populate('event');
            if (!contribution) {
                res.status(404).json({ success: false, error: "Contribution not found" });
                return;
            }
            const stID2 = contribution.student;

            const STData = await StudentModel.findOne({user: userId});
            if(!STData){
                return res.status(400).json({success: false, error: "Not found student"});
            }
            const facultyID = STData.faculty;
            const studentID = STData._id;

            const eventID = contribution.event;
            const eventData = await EventModel.findById(eventID);
            if(!eventData){
                return res.status(400).json({success: false, error: "Not found event"});
            }
            const eventFacultyID = eventData.faculty;

            const deadline1 = eventData.deadline1;
            const deadline2 = eventData.deadline2;

            const date = Date.now();
            const status = "Update";

            if(facultyID.equals(eventFacultyID) && stID2.equals(studentID)){
                
                    contribution.contribution = req.body.contribution;  
                    contribution.date = date;
                    contribution.filetype = req.body.filetype; //chọn kiểu file sẽ submit;
                

                if(date > deadline1.getTime() && date <= deadline2.getTime()){
                    await contribution.save();

                    await NotificationMCModel.create({
                        student: studentID,
                        contribution: contributionId,
                        event: eventID,
                        faculty: eventFacultyID,
                        date: date,
                        status: status
                    });
        
                    // Send email notification to marketing coordinator
                    const marketingCoordinators = await MarketingCoordinatorModel.find({ faculty: eventFacultyID });
                    if (marketingCoordinators) {
                        marketingCoordinators.forEach(async (mc) => {
                            try {
                                const userId = mc.user;
                                const userData = await UserModel.findById(userId);
                                if (userData) {
                                    const userEmail = userData.email;
                                    const transporter = nodemailer.createTransport({
                                        service: 'gmail',
                                        auth: {
                                            user: process.env.EMAIL_GMAIL,
                                            pass: process.env.PASSWORD_GMAIL
                                        }
                                    });

                                    const mailOptions = {
                                        from: 'projectsystemcomp1640@gmail.com',
                                        to: userEmail,
                                        subject: 'Contribution Edited',
                                        text: `A student has edited their contribution in the event ${eventData.requirement}. Please check the portal for details.`
                                    };

                                    await transporter.sendMail(mailOptions);

                                    console.log(`Email sent to ${userEmail}`);
                                } else {
                                    console.error(`Marketing coordinator not found`);
                                }
                            } catch (error) {
                                console.error(`Error sending email to marketing coordinator:`, error);
                            }
                        });
                    } else {
                        console.error(`Marketing coordinator not found`);
                    }

                    res.status(201).json({ success: true, message: "Contribution is edited"});
                } else {
                    res.status(400).send("Deadline 2 for this event has passed. You cannot edit available documents.");
                }

            } else {
                res.status(500).send("Event Faculty not matched");
            }
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        //-------------------------------------------------
        
    } catch (error) {
        if (error.name === 'ValidationError') {
           let InputErrors = {};
           for (let field in error.errors) {
              InputErrors[field] = error.errors[field].message;
           }
            console.error("Error while edit contribution:", error);
            res.status(500).json({ success: false, error: "Internal Server Error", InputErrors });
        }
     }
});

//-----------------------------------
module.exports = router;
