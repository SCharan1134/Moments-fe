import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";

const validationSchema = Yup.object().shape({
  description: Yup.string().required("Description is required"),
  file: Yup.string().required("Image is required"),
  visibility: Yup.string().required("Visibility is required"),
});

const CreateMoment: React.FC = () => {
  const { _id } = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", values.description);
      if (values.file) {
        formData.append("moment", values.file);
        formData.append("momentPath", values.file.name);
      }
      formData.append("visibility", values.visibility);
      console.log(...formData);
      const response = await axios.post(
        "http://localhost:3001/moments/createmoment",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Moment posted:", response.data);
    } catch (error) {
      console.error("Error posting moment:", error);
    }
  };

  return (
    <div >
      <Formik
        initialValues={{
          description: "",
          file: null,
          visibility: "public",
        }}
        validationSchema={validationSchema}
        onSubmit={(values: any) => {
          handleSubmit(values);
        }}
      >
        {({ setFieldValue }) => (
          <Form >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <Field
                type="text"
                id="description"
                name="description"
                placeholder="Enter description"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="file"
              >
                Image
              </label>
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
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="visibility"
              >
                Visibility
              </label>
              <Field
                as="select"
                id="visibility"
                name="visibility"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends</option>
              </Field>
              <ErrorMessage
                name="visibility"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Post Moment
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateMoment;
