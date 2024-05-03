var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');
const archiver = require('archiver');
const path = require('path');

var FacultyModel = require('../models/FacultyModel');
var UserModel = require('../models/UserModel');
var MarketingManagerModel = require('../models/MarketingManagerModel');
var MarketingCoordinatorModel = require('../models/MarketingCoordinatorModel');
var EventModel = require('../models/EventModel');
var StudentModel = require('../models/StudentModel');
var ContributionModel = require('../models/ContributionModel');

const {checkAdminSession, checkMMSession, verifyToken} = require('../middlewares/auth');
//-------------------------------------------
//import "bcryptjs" library
var bcrypt = require('bcryptjs');
const {equal} = require('assert');
var salt = 8;                     //random value

//-------------------------------------------------------------------------
// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/') // Set the destination folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()) // Set the filename to avoid name conflicts
    }
});

const upload = multer({storage: storage});


//-------------------Phần này cho Role Admin-----------------------------------------------------
//show all 
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if (!userData) {
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if (userRole === '65e61d9bb8171b6e90f92da3') {
            //Code ở đây--------------------------
            var marketingmanagerList = await MarketingManagerModel.find({}).populate('user');
            //render view and pass data
            res.status(200).json({success: true, data: marketingmanagerList});
            //----------------------------------
        } else {
            return res.status(400).json({success: false, error: "Not right Role"});
        }
        //-------------------------------------------------
    } catch (error) {
        console.error("Error while fetching MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------------------------------
//delete specific marketingmanager
router.get('/delete/:id', verifyToken, async (req, res) => {
    //req.params: get value by url
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if (!userData) {
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if (userRole === '65e61d9bb8171b6e90f92da3') {
            //Code ở đây--------------------------
            const marketingmanagerId = req.params.id;
            const marketingmanager = await MarketingManagerModel.findById(marketingmanagerId);
            if (!marketingmanager) {
                res.status(404).json({success: false, error: "Marketing manager not found"});
                return;
            }
            // Fetch user details by ID
            const userId = marketingmanager.user;
            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({success: false, error: "Marketing manager not found"});
                return;
            }
            await MarketingManagerModel.findByIdAndDelete(marketingmanagerId);
            await UserModel.findByIdAndDelete(userId);
            res.status(200).json({success: true, message: "Marketing Manager deleted successfully"});
            //----------------------------------
        } else {
            return res.status(400).json({success: false, error: "Not right Role"});
        }
        //-------------------------------------------------
    } catch (error) {
        console.error("Error while deleting MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------------------------------
//create marketingmanager
//render form for user to input
router.get('/add', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if (!userData) {
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if (userRole === '65e61d9bb8171b6e90f92da3') {
            //Code ở đây--------------------------
            res.status(200).json({success: true, message: "Render add marketing coordinator form"});
            //----------------------------------
        } else {
            return res.status(400).json({success: false, error: "Not right Role"});
        }
        //-------------------------------------------------
    } catch (error) {
        console.error("Error while adding MM list:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/add', verifyToken, async (req, res) => {
    //get value by form : req.body
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if (!userData) {
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if (userRole === '65e61d9bb8171b6e90f92da3') {
            //Code ở đây--------------------------
            const name = req.body.name;
            const dob = req.body.dob;
            const gender = req.body.gender;
            const address = req.body.address;
            const image = req.body.image;

            const email = req.body.email;
            const password = req.body.password;
            const hashPassword = bcrypt.hashSync(password, salt);
            const role = '65e61d9bb8171b6e90f92da4'; //objectID

            //create users then add new created users to user field of collection marketing_manager
            const availableUser = await UserModel.findOne({email: email});
            if (availableUser) {
                res.status(500).json({success: false, error: "User existed"});
            } else {
                const users = await UserModel.create(
                    {
                        email: email,
                        password: hashPassword,
                        role: role
                    }
                );
                const newMM = await MarketingManagerModel.create(
                    {
                        name: name,
                        dob: dob,
                        gender: gender,
                        address: address,
                        image: image,
                        user: users
                    }
                );
                if (newMM) {
                    res.status(201).json({success: true, message: "Marketing Manager created successfully"});
                } else {
                    res.status(500).json({success: false, message: "Error Marketing Manager created "});
                }
            }
            //----------------------------------
        } else {
            return res.status(400).json({success: false, error: "Not right Role"});
        }
        //-------------------------------------------------

    } catch (err) {
        if (err.name === 'ValidationError') {
            let InputErrors = {};
            for (let field in err.errors) {
                InputErrors[field] = err.errors[field].message;
            }
            console.error("Error while adding marketing manager:", err);
            res.status(500).json({success: false, err: "Internal Server Error", InputErrors});
        }
    }

});

//---------------------------------------------------------------------------
//edit marketingmanager
// Render form for editing a specific marketingmanager
router.get('/edit/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if (!userData) {
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if (userRole === '65e61d9bb8171b6e90f92da3') {
            //Code ở đây--------------------------
            // Fetch marketingmanager details by ID
            const marketingmanagerId = req.params.id;
            const marketingmanager = await MarketingManagerModel.findById(marketingmanagerId);
            if (!marketingmanager) {
                res.status(404).json({success: false, error: "Marketing Manager not found"});
                return;
            }
            // Fetch user details by ID
            const userId = marketingmanager.user;
            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({success: false, error: "User not found"});
                return;
            }
            res.status(200).json({success: true, message: "Render add marketing manager form", marketingmanager, user});
            //----------------------------------
        } else {
            return res.status(400).json({success: false, error: "Not right Role"});
        }
        //-------------------------------------------------
        // Render edit form with marketingmanager details and dropdown options
    } catch (error) {
        // Handle errors (e.g., marketingmanager not found)
        console.error(error);
        res.status(404).send('MarketingManager not found');
    }
});

// Handle form submission for editing a marketingmanager
router.post('/edit/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if (!userData) {
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if (userRole === '65e61d9bb8171b6e90f92da3') {
            //Code ở đây--------------------------
            // Fetch marketingmanager by ID
            const marketingmanagerId = req.params.id;
            const marketingmanager = await MarketingManagerModel.findById(marketingmanagerId);
            if (!marketingmanager) {
                res.status(404).json({success: false, error: "Marketing Manager not found"});
                return;
            }
            // Fetch user details by ID
            const userId = marketingmanager.user;
            const user = await UserModel.findById(userId);
            if (!user) {
                res.status(404).json({success: false, error: "User not found"});
                return;
            }

            // Update marketingmanager details
            marketingmanager.name = req.body.name;
            marketingmanager.dob = req.body.dob;
            marketingmanager.gender = req.body.gender;
            marketingmanager.address = req.body.address;
            marketingmanager.image = req.body.image;
            
            const editMM = await marketingmanager.save();
            if (editMM) {
                res.status(200).json({success: true, message: "Marketing Manager updated successfully"});
            } else {
                res.status(500).json({success: false, message: "Marketing Manager updated fail"});
            }

            user.email = req.body.email;
            user.password = bcrypt.hashSync(req.body.password, salt);
            const editUser = await user.save();
            if (editUser) {
                res.status(200).json({success: true, message: "User of Marketing Manager updated successfully"});
            } else {
                res.status(500).json({success: false, message: "User of Marketing Manager updated fail"});
            }
            //----------------------------------
        } else {
            return res.status(400).json({success: false, error: "Not right Role"});
        }
        //-------------------------------------------------

    } catch (err) {
        if (err.name === 'ValidationError') {
            let InputErrors = {};
            for (let field in err.errors) {
                InputErrors[field] = err.errors[field].message;
            }
            console.error("Error while updating marketing manager:", err);
            res.status(500).json({success: false, err: "Internal Server Error", InputErrors});
        }
    }
});


//------------Phần này cho role Marketing Manager--------------
//trang chủ của MM---------------------------------------------------
router.get('/mmpage', verifyToken, checkMMSession, async (req, res) => { //Note: phần này để test
    try {
        var facultyData = await FacultyModel.find({});
        res.status(200).json({success: true, message: "Marketing Manager Menu page", facultyData});
        //---------------
        // const userId = req.userId;
        // const userData = await UserModel.findById(userId);
        // if(!userData){
        //     return res.status(400).json({success: false, error: "Not found user"});
        // }
        // const userRole = userData.role.toString();
        // if(userRole === '65e61d9bb8171b6e90f92da4'){
        //     //Code ở đây--------------------------

        //     //----------------------------------
        // } else {
        //     return res.status(400).json({ success: false, error: "Not right Role" });
        // }
        //-------------------------------------------------
    } catch (error) {
        console.error("Error while fetching faculty list:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/facultyDetail/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if (!userData) {
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if (userRole === '65e61d9bb8171b6e90f92da4') {
            //Code ở đây--------------------------
            var facultyID = req.params.id;
            const eventData = await EventModel.find({faculty: facultyID});
            const MCData = await MarketingCoordinatorModel.find({faculty: facultyID});
            const StudentData = await StudentModel.find({faculty: facultyID});
            res.status(200).json({success: true, eventData, StudentData, MCData});
            //----------------------------------
        } else {
            return res.status(400).json({success: false, error: "Not right Role"});
        }
        //-------------------------------------------------
    } catch (err) {
        console.error("Error while fetching faculty detail:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/eventDetail/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if (!userData) {
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if (userRole === '65e61d9bb8171b6e90f92da4') {
            //Code ở đây--------------------------
            var eventId = req.params.id;
            const eventData = await EventModel.findById(eventId);
            if (eventData) {
                const contributionList = await ContributionModel.find({event: eventId}).populate('student');
                const chosenYesContributions = await contributionList.filter(contribution => contribution.choosen === "Yes");
                if (chosenYesContributions) {
                    res.status(200).json({success: true, eventData, chosenYesContributions});
                } else {
                    res.status(404).json({success: false, error: "Event not found"});
                    return;
                }
            } else {
                res.status(404).json({success: false, error: "Event not found"});
                return;
            }
            //----------------------------------
        } else {
            return res.status(400).json({success: false, error: "Not right Role"});
        }
        //-------------------------------------------------
    } catch (error) {
        console.error("Error while fetching event detail:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/contributionDetail/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if (!userData) {
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if (userRole === '65e61d9bb8171b6e90f92da4') {
            //Code ở đây--------------------------
            // Fetch contribution details by ID
            const contributionId = req.params.id;
            const contribution = await ContributionModel.findById(contributionId).populate('student').populate('event');
            const faculty = await StudentModel.findById(contribution.student).populate('faculty');
            if (!contribution) {
                res.status(404).json({success: false, error: "Contribution not found"});
                return;
            }
            res.status(200).json({success: true, message: "Render contribution", data: contribution, faculty});
            //----------------------------------
        } else {
            return res.status(400).json({success: false, error: "Not right Role"});
        }
        //-------------------------------------------------
    } catch (error) {
        // Handle errors (e.g., contribution not found)
        console.error(error);
        res.status(404).send('Contribution not found');
    }
});

//tải file về để chấm điểm
router.get('/download/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if (!userData) {
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if (userRole === '65e61d9bb8171b6e90f92da4') {
            //Code ở đây--------------------------
            const contributionId = req.params.id;
            const contributionData = await ContributionModel.findById(contributionId);
            if (!contributionData) {
                return res.status(400).json({success: false, error: 'Contribution not found'});
            }

            if (!contributionData.contribution) {
                return res.status(400).json({success: false, error: 'No submission found for this contribution'});
            }

            const contributionType = contributionData.filetype;
            const eventId = contributionData.event;
            const studentId = contributionData.student;

            const eventData = await EventModel.findById(eventId);
            if (!eventData) {
                return res.status(400).json({success: false, error: 'Event not found'});
            }

            const studentData = await StudentModel.findById(studentId);
            if (!studentData) {
                return res.status(400).json({success: false, error: 'Student not found'});
            }

            const studentName = studentData.name;
            const contributionFilename = contributionData.contribution;  // More descriptive name

            const imagePath = path.join(__dirname, '../public/images/', contributionFilename);  // Sanitize path

            if (contributionType === 'word') {
                const archive = archiver('zip');
                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', `attachment; filename="student_${studentName}_word.zip"`);

                archive.pipe(res);
                archive.append(Buffer.from(contributionData.contribution, 'base64'), {name: 'student_word.docx'});
                archive.finalize();
            } else if (contributionType === 'image') {
                const base64Data = contributionData.contribution;
                const buffer = Buffer.from(base64Data, 'base64');
                const archive = archiver('zip');
                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', 'attachment; filename="student_${studentName}_image.zip"');
                archive.pipe(res);
                archive.append(buffer, { name: '${studentName}_image.jpg '}); // You can adjust the filename here if needed
                archive.finalize();
            }
            //----------------------------------
        } else {
            return res.status(400).json({success: false, error: "Not right Role"});
        }
        //-------------------------------------------------
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({success: false, error: 'Internal Error'});
    }
});

//đọc thông tin của MM-------------------------------------------------
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if (!userData) {
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if (userRole === '65e61d9bb8171b6e90f92da4') {
            //Code ở đây--------------------------
            var mmUserId = req.userId;
            var UserData = await UserModel.findById(mmUserId);
            if (UserData) {
                var MMData = await MarketingManagerModel.findOne({user: mmUserId});
            } else {
                res.status(500).json({success: false, error: "Profile not found"});
            }
            res.status(200).json({success: true, message: "Render edit marketing manager form", UserData, MMData});
            //----------------------------------
        } else {
            return res.status(400).json({success: false, error: "Not right Role"});
        }
        //-------------------------------------------------
    } catch (error) {
        console.error("Error while fetching M0:", error);
        res.status(500).send("Internal Server Error");
    }
});


//sửa thông tin của MM-------------------------------------------
router.get('/editMM/:id', verifyToken, async (req, res) => {
    const marketingmanagerId = req.params.id;
    const marketingmanager = await MarketingManagerModel.findById(marketingmanagerId);
    if (!marketingmanager) {
        res.status(404).json({success: false, error: "Marketing Manager not found"});
        return;
    }
    // Fetch user details by ID
    const userId = marketingmanager.user;
    const user = await UserModel.findById(userId);
    if (!user) {
        res.status(404).json({success: false, error: "User not found"});
        return;
    }
    const mmUserId = req.userId;
    if (userId.equals(mmUserId)) {
        try {
            const userId = req.userId;
            const userData = await UserModel.findById(userId);
            if (!userData) {
                return res.status(400).json({success: false, error: "Not found user"});
            }
            const userRole = userData.role.toString();
            if (userRole === '65e61d9bb8171b6e90f92da4') {
                //Code ở đây--------------------------
                res.status(200).json({
                    success: true,
                    message: "Render add marketing manager form",
                    marketingmanager,
                    user
                });
                //----------------------------------
            } else {
                return res.status(400).json({success: false, error: "Not right Role"});
            }
            //-------------------------------------------------
        } catch (error) {
            // Handle errors (e.g., marketingmanager not found)
            console.error(error);
            res.status(404).send('MarketingManager not found');
        }
    } else {
        res.status(404).send('MarketingManager not found');
    }

});

router.post('/editMM/:id', verifyToken, async (req, res) => {
    const marketingmanagerId = req.params.id;
    const marketingmanager = await MarketingManagerModel.findById(marketingmanagerId);
    if (!marketingmanager) {
        res.status(404).json({success: false, error: "Marketing Manager not found"});
        return;
    }
    // Fetch user details by ID
    const userId = marketingmanager.user;
    const user = await UserModel.findById(userId);
    if (!user) {
        res.status(404).json({success: false, error: "User not found"});
        return;
    }
    const mmUserId = req.userId;
    if (userId.equals(mmUserId)) {
        try {
            const userId = req.userId;
            const userData = await UserModel.findById(userId);
            if (!userData) {
                return res.status(400).json({success: false, error: "Not found user"});
            }
            const userRole = userData.role.toString();
            if (userRole === '65e61d9bb8171b6e90f92da4') {
                //Code ở đây--------------------------
                // Update marketingmanager details
                if (req.body.name) {
                    marketingmanager.name = req.body.name;
                }
                if (req.body.dob) {
                    marketingmanager.dob = req.body.dob;
                }
                if (req.body.gender) {
                    marketingmanager.gender = req.body.gender;
                }
                if (req.body.address) {
                    marketingmanager.address = req.body.address;
                }
                // If a new image is uploaded, update it
                if (req.body.image) {
                    marketingmanager.image = req.body.image;
                }
                await marketingmanager.save();

                if (req.body.password) {
                    user.password = bcrypt.hashSync(req.body.password, salt);
                    await user.save();
                }

                res.status(200).json({success: true, message: "Update my MM data success"});
                //----------------------------------
            } else {
                return res.status(400).json({success: false, error: "Not right Role"});
            }
            //-------------------------------------------------
        } catch (err) {
            if (err.name === 'ValidationError') {
                let InputErrors = {};
                for (let field in err.errors) {
                    InputErrors[field] = err.errors[field].message;
                }
                console.error("Error while updating marketing manager:", err);
                res.status(500).json({success: false, err: "Internal Server Error", InputErrors});
            }
        }
    } else {
        res.status(404).send('MarketingManager not found');
    }
});

//---------------------------------------------------


module.exports = router;
