import {Outlet, useRoutes} from "react-router-dom";
import SideBarMarketingManager from "../sidebar/sidebar_marketing-manager";
import Header from "../header/header";
import styles from "../../shared/style.module.css";
import SideBarMarketingCoordinator from "../sidebar/sidebar_marketing-coordinator";
import {USER_ROLE} from "../../shared/contain";
import SideBarGuest from "../sidebar/sidebar_guest";
import {useContext} from "react";
import {AuthContext} from "../../contexts/AuthContext";
import {apiUrl, LOCAL_URL} from "../../contexts/constants";
import SideBarStudent from "../sidebar/sidebar_student";

const Layout = () => {
    const {
        authState: {authLoading, isAuthenticated, user},
    } = useContext(AuthContext);

    const checkRole = () => {
        if (!user) {
        } else {
            if (user.role === USER_ROLE.MARKETING_MANAGER) {
                return <SideBarMarketingManager/>;
            } else if (user.role === USER_ROLE.MARKETING_COORDINATOR) {
                return <SideBarMarketingCoordinator/>;
            } else if (user.role === USER_ROLE.GUEST) {
                return <SideBarGuest/>;
            } else if (user.role === USER_ROLE.STUDENT) {
                return <SideBarStudent/>;
            }
        }
    };

    return (
        <div className={styles.abc}>
            <div className={styles.container}>
                {checkRole()}
                <div className={styles.content}>
                    <Header/>
                    <Outlet/>
                </div>
            </div>
            <div className={styles.footer}></div>
        </div>
    );
};

export default Layout;

