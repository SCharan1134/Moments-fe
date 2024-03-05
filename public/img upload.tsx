import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import React from "react";

const Home: React.FC = () => {
  const user = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  const validationSchema = Yup.object({
    userName: Yup.string().required("Username is required"),
    file: Yup.string().required("Avatar is required"),
  });
  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("avatarPath", values.file.name);
      formData.append("userName", values.userName);
      formData.append("avatar", values.file);
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
      console.log("Form submitted successfully", response);
      // Optionally, you can redirect the user or show a success message
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <div>{user.userName}</div>
      <h2>update</h2>
      <Formik
        initialValues={{ userName: "", file: null }}
        validationSchema={validationSchema}
        onSubmit={(values: any) => {
          handleSubmit(values);
        }}
      >
        {({ setFieldValue }) => (
          <Form>
            <div>
              <label htmlFor="userName">Username:</label>
              <Field type="text" id="userName" name="userName" />
              <ErrorMessage name="userName" component="div" />
            </div>
            <div>
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
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
      <img src={`http://localhost:3001/avatar/${user.avatarPath}`} />
    </div>
  );
};

export default Home;
