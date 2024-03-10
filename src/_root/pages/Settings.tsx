import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { changeUserDetails } from "@/state";

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  const validationSchema = Yup.object({
    userName: Yup.string(),
    file: Yup.string(),
  });
  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const formData = new FormData();
      if (values.userName) {
        formData.append("userName", values.userName);
      }

      if (values.file) {
        formData.append("avatarPath", values.file.name);
        formData.append("avatar", values.file);
      }
      console.log(...formData);

      const response = await axios.post(
        `http://localhost:3001/users/updateuser/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Form submitted successfully", response.data.user);
      if (response.data.user) {
        dispatch(
          changeUserDetails({
            user: response.data.user,
          })
        );
        resetForm();
      }
      // Optionally, you can redirect the user or show a success message
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">Edit Profile</h2>
      <Formik
        initialValues={{ userName: "", file: null }}
        validationSchema={validationSchema}
        onSubmit={(values: any, { resetForm }: any) => {
          handleSubmit(values, { resetForm });
        }}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className="p-2 flex gap-2">
              <label htmlFor="userName">Username:</label>
              <Field
                type="text"
                id="userName"
                name="userName"
                className="border-2 border-black"
              />
              <ErrorMessage name="userName" component="div" />
            </div>
            <div className="p-2 flex gap-10">
              <label htmlFor="file">Avatar:</label>
              <input
                type="file"
                accept="image/*"
                id="file"
                name="file"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("file", event.currentTarget.files![0]);
                }}
              />
            </div>
            <button
              type="submit"
              className="bg-slate-700 text-white py-2 px-4 rounded-md hover:bg-slate-400  transition-all"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Settings;
