import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Course from "../components/Course/Course";
import MainLayout from "../components/Layouts/MainLayout";
import UserContext from "../components/context/userContext";
import Login from "../components/Login/Login";
import Register from "./../components/Register/Register";
import Archive from "./../components/Course/Archive";
import SingleCourse from "./../components/Course/SingleCourse";
import UserProfile from "./../components/Profile/UserProfile";
import { useSelector, useDispatch } from "react-redux";
import { paginate } from "./../utils/paginate";
import { addUser, clearUser } from "./../actions/user";
import { decodeToken } from "./../utils/decodeToken";
import Logout from "./../components/Login/Logout";
import { isEmpty } from "lodash";
import NotFound from "./../components/common/NotFound";
import PrivateLayout from "../components/Layouts/PrivateLayout";
import Dashboard from "../components/admin/Dashboard";
import CourseTable from "../components/admin/CourseTable";
import AdminContext from "../components/context/AdminContext";

const Toplearn = () => {
    const courses = useSelector((state) => state.courses);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const indexCourses = paginate(courses, 1, 8);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = decodeToken(token);
            const dateNow = Date.now() / 1000;

            if (decodedToken.payload.exp < dateNow) {
                localStorage.removeItem("token");
                dispatch(clearUser());
            } else dispatch(addUser(decodedToken.payload.user));
        }
    }, []);

    return (
        <Switch>
            <Route path={["/dashboard"]}>
                <PrivateLayout>
                    <Route
                        path="/dashboard/courses"
                        render={() =>
                            !isEmpty(user) && user.isAdmin ? (
                                <AdminContext courses={courses}>
                                    <CourseTable />
                                </AdminContext>
                            ) : (
                                <Redirect to="/" />
                            )
                        }
                    />
                    <Route
                        path="/dashboard"
                        exact
                        render={() =>
                            !isEmpty(user) && user.isAdmin ? (
                                <Dashboard courses={courses} />
                            ) : (
                                <Redirect to="/" />
                            )
                        }
                    />
                </PrivateLayout>
            </Route>
            <Route path={["/"]}>
                <MainLayout>
                    <Switch>
                        <Route
                            path="/login"
                            render={() =>
                                isEmpty(user) ? (
                                    <UserContext>
                                        <Login />
                                    </UserContext>
                                ) : (
                                    <Redirect to="/" />
                                )
                            }
                        />
                        <Route
                            path="/logout"
                            render={() =>
                                isEmpty(user) ? <Redirect to="/" /> : <Logout />
                            }
                        />
                        <Route
                            path="/register"
                            render={() =>
                                isEmpty(user) ? (
                                    <UserContext>
                                        <Register />
                                    </UserContext>
                                ) : (
                                    <Redirect to="/" />
                                )
                            }
                        />
                        <Route path="/archive" component={Archive} />
                        <Route path="/course/:id" component={SingleCourse} />
                        <Route path="/user-profile" component={UserProfile} />
                        <Route
                            path="/"
                            exact
                            render={() =>
                                indexCourses.length > 0 ? (
                                    <Course courses={indexCourses} />
                                ) : (
                                    <h2
                                        style={{
                                            textAlign: "center",
                                            margin: "2em",
                                        }}
                                    >
                                        هیچ دوره ای جهت نمایش نیست
                                    </h2>
                                )
                            }
                        />
                        <Route path="*" exact component={NotFound} />
                    </Switch>
                </MainLayout>
            </Route>
        </Switch>
    );
};

export default Toplearn;
