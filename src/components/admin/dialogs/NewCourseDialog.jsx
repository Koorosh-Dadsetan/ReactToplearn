import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import { createNewCourse } from "../../../actions/courses";
import { dashContext } from './../../context/dashContext';
import SimpleReactValidator from "simple-react-validator";

const NewCourseDialog = ({ showDialog, closeDialog }) => {
    const [title, setTitle] = useState();
    const [price, setPrice] = useState();
    const [info, setInfo] = useState();
    const [, forceUpdate] = useState();
    const [imageUrl, setImageUrl] = useState();

    const context = useContext(dashContext);
    const { validator } = context;

    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();

        try {
            if (validator.current.allValid()) {
                let data = new FormData();
                data.append("title", title);
                data.append("price", Number.parseInt(price));
                data.append("imageUrl", event.target.imageUrl.files[0]);
                data.append("info", info);

                //Dispatch
                dispatch(createNewCourse(data));
                closeDialog();
            } else {
                validator.current.showMessages();
                forceUpdate(1);
            }
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <DialogOverlay
            isOpen={showDialog}
            onDismiss={closeDialog}
            style={{ background: "hsla(0, 100%, 100%, 0.9)" }}
        >
            <DialogContent
                style={{
                    border: "solid 5px hsla(0, 0%, 0%, 0.5)",
                    borderRadius: "10px",
                    boxShadow: "0px 10px 50px hsla(0, 0%, 0%, 0.33)",
                }}
            >
                <div className="inner form-layer">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="title"
                            style={{ marginBottom: 3 }}
                            className="form-control"
                            placeholder="عنوان دوره"
                            aria-describedby="title"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                validator.current.showMessageFor("title");
                            }}
                        />
                        {validator.current.message("title", title, "required|min:5")}
                        <input
                            type="text"
                            name="price"
                            style={{ marginBottom: 3 }}
                            className="form-control"
                            placeholder="قیمت دوره به تومان"
                            aria-describedby="price"
                            value={price}
                            onChange={(e) => {
                                setPrice(e.target.value);
                                validator.current.showMessageFor("price");
                            }}
                        />
                        {validator.current.message("price", price, "required|integer")}
                        <input
                            type="file"
                            name="imageUrl"
                            style={{ marginBottom: 3 }}
                            className="form-control mb-2"
                            aria-describedby="imageUrl"
                            onChange={() => {
                                setImageUrl(true);
                                validator.current.showMessageFor("imageUrl");
                            }}
                        />
                        {validator.current.message("imageUrl", imageUrl, "required")}
                        <textarea
                            name="info"
                            placeholder="توضیحات دوره"
                            className="form-control"
                            style={{ marginBottom: 3 }}
                            value={info}
                            onChange={(e) => {
                                setInfo(e.target.value);
                                validator.current.showMessageFor("info");
                            }}
                        />
                        {validator.current.message("info", info, "required|min:5")}
                        <button
                            type="submit"
                            className="btn btn-success "
                            style={{ margin: "1em" }}
                        >
                            ثبت دوره
                        </button>
                        <button
                            className="btn btn-warning mr-5"
                            style={{ margin: "1em" }}
                            onClick={closeDialog}
                        >
                            انصراف
                        </button>
                    </form>
                </div>
            </DialogContent>
        </DialogOverlay>
    );
};

export default NewCourseDialog;
