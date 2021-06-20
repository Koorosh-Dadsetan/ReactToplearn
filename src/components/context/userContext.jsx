import React, { useState, useRef, useEffect } from "react";
import SimpleReactValidator from "simple-react-validator";
import { useDispatch } from "react-redux";
import { context } from "./context";
import { successMessage, errorMessage } from "./../../utils/message";
import { loginUser, registerUser } from "../../services/userService";
import { decodeToken } from "./../../utils/decodeToken";
import { withRouter } from "react-router";
import { addUser } from "./../../actions/user";
import { showLoading, hideLoading } from "react-redux-loading-bar";

const UserContext = ({ children, history }) => {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [policy, setPolicy] = useState();
    const [, forceUpdate] = useState();

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            setFullname();
            setEmail();
            setPassword();
            setPolicy();
            forceUpdate();
        }
    }, []);

    const validator = useRef(
        new SimpleReactValidator({
            messages: {
                required: "پر کردن این فیلد الزامی میباشد",
                min: "کمتر از 5 کاراکتر نباید باشد",
                email: "ایمیل نوشته شده صحیح نمی باشد"
            },
            element: message => <div style={{ color: "red" }}>{message}</div>
        })
    );

    const handleLogin = async event => {
        event.preventDefault();
        const user = { email, password };

        try {
            if (validator.current.allValid()) {
                dispatch(showLoading());
                const { status, data } = await loginUser(user);
                if (status === 200) {
                    successMessage("ورود موفقیت آمیز بود.");
                    localStorage.setItem("token", data.token);
                    dispatch(addUser(decodeToken(data.token).payload.user));
                    dispatch(hideLoading());
                    history.replace("/");
                }
            } else {
                validator.current.showMessages();
                forceUpdate(1);
            }
        } catch (ex) {
            console.log(ex);
            dispatch(hideLoading());
            errorMessage("مشکلی پیش آمده.");
        }
    };

    const handleRegister = async event => {
        event.preventDefault();
        const user = {
            fullname,
            email,
            password
        };

        try {
            if (validator.current.allValid()) {
                dispatch(showLoading());
                const { status } = await registerUser(user);
                if (status === 201) {
                    successMessage("کاربر با موفقیت ساخته شد.");
                    dispatch(hideLoading());
                    history.push("/login");
                }
            } else {
                validator.current.showMessages();
                forceUpdate(1);
            }
        } catch (ex) {
            errorMessage("مشکلی در ثبت نام پیش آمده.");
            dispatch(hideLoading());
            console.log(ex);
        }
    };

    return (
        <context.Provider
            value={{
                fullname,
                setFullname,
                email,
                setEmail,
                password,
                setPassword,
                policy,
                setPolicy,
                validator,
                handleLogin,
                handleRegister
            }}
        >
            {children}
        </context.Provider>
    );
};

export default withRouter(UserContext);
