var express = require('express');
var router = express.Router();
const fs = require('fs');
const multer = require('multer');

var ContributionModel = require('../models/ContributionModel');
var StudentModel = require('../models/StudentModel');
var EventModel = require('../models/EventModel');
var UserModel = require('../models/UserModel');
const {checkAdminSession, verifyToken} = require('../middlewares/auth');
//-------------------------------------------------------------------------
// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/contributions/') // Set the destination folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()) // Set the filename to avoid name conflicts
    }
});

const upload = multer({ storage: storage });


//------------------------------------------------------------------------
//show all 
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            var contributionList = await ContributionModel.find({});
            res.status(200).json({ success: true, data: contributionList });
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        
    } catch (error) {
        console.error("Error while fetching contribution list:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//-----------------------------------------------------------------------
//delete specific contribution
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await UserModel.findById(userId);
        if(!userData){
            return res.status(400).json({success: false, error: "Not found user"});
        }
        const userRole = userData.role.toString();
        if(userRole === '65e61d9bb8171b6e90f92da3'){
            //Code ở đây
            const contributionId = req.params.id;
            const deletedContribution = await ContributionModel.findByIdAndDelete(contributionId);
            if (!deletedContribution) {
                res.status(404).json({ success: false, error: "Contribution not found" });
                return;
            }
            res.status(200).json({ success: true, message: "Contribution deleted successfully" });
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        
    } catch (error) {
        console.error("Error while deleting contribution:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//------------------------------------------------------------------------
//create contribution
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
            var studentList = await StudentModel.find({});
            var eventList = await EventModel.find({});
            res.status(200).json({success: true, studentList, eventList})
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
        
    } catch (error){
        console.error("Error while making new contribution:", error);
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
            const student = req.body.student;
            const choosen = req.body.choosen;
            const comment = req.body.comment;
            const contribution = req.body.contribution;
            const date = req.body.date;
            const event = req.body.event;
            const filetype = req.body.filetype;
            
            await ContributionModel.create(
                {
                    student: student,
                    choosen: choosen,
                    comment: comment,
                    contribution: contribution,
                    date: date,
                    event: event,
                    filetype: filetype
                }
            );
            res.status(201).json({ success: true, message: "Contribution created successfully" });
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
            console.error("Error while adding contribution:", error);
            res.status(500).json({ success: false, error: "Internal Server Error", InputErrors });
        }
     }
});

//---------------------------------------------------------------------------
// edit contribution
// Render form for editing a specific contribution
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
            // Fetch contribution details by ID
            const contributionId = req.params.id;
            const contribution = await ContributionModel.findById(contributionId).populate('student').populate('event');
            if (!contribution) {
                res.status(404).json({ success: false, error: "Contribution not found" });
                return;
            }
            // Fetch student and event lists for dropdowns
            const studentList = await StudentModel.find({});
            const eventList = await EventModel.find({});
            res.status(200).json({ success: true, contribution, studentList, eventList });
            //----------------------------------
        } else {
            return res.status(400).json({ success: false, error: "Not right Role" });
        }
//-------------------------------------------------
    } catch (error) {
        console.error("Error while fetching contribution details:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Handle form submission for editing a contribution
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
            const contributionId = req.params.id;
            const contribution = await ContributionModel.findById(contributionId);
            if (!contribution) {
                res.status(404).json({ success: false, error: "Contribution not found" });
                return;
            }
            // Update contribution details
            contribution.student = req.body.student;
            contribution.choosen = req.body.choosen;
            contribution.comment = req.body.comment;
            contribution.date = req.body.date;
            contribution.event = req.body.event;
            contribution.filetype = req.body.filetype;
            contribution.contribution = req.body.contribution;
            
            await contribution.save();
            res.status(200).json({ success: true, message: "Contribution updated successfully" });
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
            console.error("Error while updating contribution:", err);
            res.status(500).json({ success: false, err: "Internal Server Error", InputErrors });
        }
     }
});


module.exports = router;
