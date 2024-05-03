import Nav from './layout/Nav';
import {BrowserRouter, Routes, Route, Switch, Outlet} from 'react-router-dom';
import Footer from './layout/Footer';
import Login from './components/auth/Login';
import AddStudent from './components/admin/AddStudent';
import Student from './components/admin/Student';
import MCoordinator from './components/admin/MCoordinator'
import MManager from './components/admin/MManager';
import Faculty from './components/admin/Faculty';
import PersonalProfile from './components/admin/PersonalProfile';
import ProtectedRoute from './routing/ProtectedRoute';
import Layout from "./components/_layout/layout";
import HomePageMarketingManager from "./pages/home_marketing_manager";
import ContributionPage from "./pages/contribution";
import ContributionDetailPage from "./pages/contributionDetail";
import FacultyPage from "./pages/faculty";
import FacultyDetailPage from "./pages/faculty_details";
import Profile from "./pages/profile";
import HomePageMarketingCoordinator from "./pages/home_marketing_coordinator";
import EventPage from "./pages/event";
import EventDetails from "./pages/event_details";
import SubmissionDetails from "./pages/submission_detail";
import HomePageGuest from "./pages/home_guest";
import ArticalDetail from "./pages/artical_detail";
import GuestEventDetails from "./pages/guest_event";
import GuestContribution from "./pages/guest_submission"

import './App.css'
import AddMCoordinator from './components/admin/AddMCoordinator';
import StudentDetail from './components/admin/StudentDetail';
import MManagerDetail from './components/admin/MManagerDetail';
import AddMManager from './components/admin/AddMManager';
import MCoordinatorDetail from './components/admin/MCoordinatorDetail';
import AddFaculty from './components/admin/AddFaculty';
import UpdateFaculty from './components/admin/UpdateFaculty';
import Guest from './components/admin/Guest';
import AddGuest from './components/admin/AddGuest';
import UpdateGuest from './components/admin/UpdateGuest';
import StudentPage from './components/student/Student';
import StudentEvent from './components/student/Event';
import StudentEventDetail from './components/student/EventDetail';
import EditContribution from './components/student/EditContribution';
import Event from './components/admin/Event';
import AddEvent from './components/admin/AddEvent';
import UpdateEvent from './components/admin/UpdateEvent';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={
                    <div className='App'>
                        <Nav/>
                        <h1>Home</h1>
                        <Footer/>
                    </div>
                }/>

                <Route element={<Layout/>}>
                    <Route path="profile" element={<Profile/>}/>
                </Route>

                <Route element={<ProtectedRoute/>}>
                    <Route path='/student' element={<Student/>}/>
                    <Route path='/addStudent' element={<AddStudent/>}/>
                    <Route path='/detailStudent/:id' element={<StudentDetail/>}/>
                    <Route path='/mmanager' element={<MManager/>}/>
                    <Route path='/addMManager' element={<AddMManager/>}/>
                    <Route path='/detailMManager/:id' element={<MManagerDetail/>}/>
                    <Route path='/facultyList' element={<Faculty/>}/>
                    <Route path='/addFaculty' element={<AddFaculty/>}/>
                    <Route path='/updateFaculty/:id' element={<UpdateFaculty/>}/>
                    <Route path='/profileAdmin' element={<PersonalProfile/>}/>
                    <Route path='/mcoordinator' element={<MCoordinator/>}/>
                    <Route path='/addMCoordinator' element={<AddMCoordinator/>}/>
                    <Route path='/detailMCoordinator/:id' element={<MCoordinatorDetail/>}/>
                    <Route path='/guestAccount' element={<Guest/>}/>
                    <Route path='/addGuest' element={<AddGuest/>}/>
                    <Route path='/updateGuest/:id' element={<UpdateGuest/>}/>
                    <Route path='/eventList' element={<Event/>}/>
                    <Route path='/addEvent' element={<AddEvent/>}/>
                    <Route path='/updateEvent/:id' element={<UpdateEvent/>}/>
                </Route>

                <Route path="marketing-manager"
                       element={<Layout/>}>
                    <Route index element={<HomePageMarketingManager/>}/>
                    <Route path="contribution/:id" element={<ContributionPage/>}/>
                    <Route
                        path="contributionDetail/:id"
                        element={<ContributionDetailPage/>}
                    />
                    <Route path="faculty" element={<FacultyPage/>}/>
                    <Route path="faculty-detail/:id" element={<FacultyDetailPage/>}/>
                </Route>

                <Route path="marketing-coordinator"
                       element={<Layout/>}>
                    <Route index element={<HomePageMarketingCoordinator/>}/>
                    <Route path="event" element={<EventPage/>}/>
                    <Route path="eventDetail/:id" element={<EventDetails/>}/>
                    <Route path="submissionDetail/:id" element={<SubmissionDetails/>}/>
                </Route>

                <Route path="guest" element={<Layout/>}>
                    <Route index element={<HomePageGuest/>}/>
                    <Route path="guestEventDetail/:id" element={<GuestEventDetails/>}/>
                    <Route path="articalDetail/:id" element={<ArticalDetail/>}/>
                    <Route path="contriButionDetail/:id" element={<GuestContribution/>}/>
                </Route>

                <Route path='studentPage' element={<Layout/>}>
                    <Route index element={<StudentPage/>}/>
                    <Route path='student-event' element={<StudentEvent/>}/>
                    <Route path='event-detail/:id' element={<StudentEventDetail/>}/>
                    <Route path='edit-contribution/:id' element={<EditContribution/>}/>
                </Route>

                <Route path='/login' element={
                    <div className={'App'}>
                        <Nav/>
                        <Login/>
                        <Footer/>
                    </div>
                }/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
