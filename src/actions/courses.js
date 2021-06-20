import { getCourses, newCourse, updateCourse, deleteCourse } from "./../services/courseService";
import { successMessage } from "./../utils/message";

export const getAllCourses = () => {
    return async (dispatch) => {
        const { data } = await getCourses();
        await dispatch({ type: "INIT", payload: data.courses });
    };
};

export const createNewCourse = (course) => {
    return async (dispatch, getState) => {
        const { data, status } = await newCourse(course);
        if (status === 201) successMessage("دوره با موفقیت ساخته شد");
        await dispatch({
            type: "ADD_COURSE",
            payload: [...getState().courses, data.course]
        });
    };
};

export const handleCourseUpdate = (courseId, updatedCourse) => {
    return async (dispatch, getState) => {
        const courses = [...getState().courses];
        const filteredCourse = courses.filter(course => course._id !== courseId);
        // const updatedCourses = [...courses];
        // const courseIndex = updatedCourses.findIndex(
        //     (course) => course._id == courseId
        // );

        // let course = updatedCourses[courseIndex];

        // course = { ...Object.fromEntries(updatedCourse) };
        // updatedCourses[courseIndex] = course;

        try {
            const { data, status } = await updateCourse(
                courseId,
                updatedCourse
            );
            console.log(data);
            if (status === 200) {
                await dispatch({
                    type: "UPDATE_COURSE",
                    payload: [data.course, ...filteredCourse],
                });
                successMessage("دوره با موفقیت ویرایش شد.");
            }
        } catch (ex) {
            await dispatch({ type: "UPDATE_COURSE", payload: [...courses] });
        }
    };
}

export const handleCourseDelete = (courseId) => {
    return async (dispatch, getState) => {
        const courses = [...getState().courses];
        const filteredCourse = courses.filter(course => course._id !== courseId);

        try {
            await dispatch({ type: "DELETE_COURSE", payload: [...filteredCourse] });
            const { status } = await deleteCourse(courseId);
            if (status === 200) successMessage("دوره با موفقیت حدف شد");
        } catch (ex) {
            await dispatch({ type: "DELETE_COURSE", payload: [...courses] });
        }
    }
}