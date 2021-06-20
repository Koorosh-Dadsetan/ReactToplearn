import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../actions/user";

const Logout = ({ history }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        localStorage.removeItem("token");
        dispatch(clearUser());
        history.push("/");
    }, []);

    return null;
};

export default withRouter(Logout);
