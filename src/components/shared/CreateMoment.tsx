import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";
import { api } from "@/apis/apiGclient";

const validationSchema = Yup.object().shape({
  description: Yup.string().required("Description is required"),
  file: Yup.array().min(1, "At least one image is required"),
  visibility: Yup.string().required("Visibility is required"),
});

interface CreateMomentProps {
  onClose: () => void;
}

const CreateMoment: React.FC<CreateMomentProps> = ({ onClose }) => {
  const { _id } = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  const { toast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);

  const handleSubmit = async (values: any) => {
    try {
      if (!values.file || values.file.length === 0) {
        console.error("No files selected");
        return;
      }
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", values.description);

      if (values.file) {
        for (const file of values.file) {
          // formData.append("moment", file);
          const imgUrl = await uploadImage(file);

          formData.append("momentPath", imgUrl);
        }
      }
      // if (values.file) {
      //   formData.append("moment", values.file);
      //   formData.append("momentPath", values.file.name);
      // }
      formData.append("visibility", values.visibility);
      console.log(...formData);
      const response = await axios.post(
        `${api}/moments/createmoment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        duration: 2000,
        description: "Moment posted",
      });

      console.log("Moment posted:", response.data);
      onClose();
    } catch (error) {
      console.error("Error posting moment:", error);
    }
  };

  const uploadImage = async (e: any) => {
    try {
      const image = new FormData();
      const cloudName = "duxz0nau4";
      image.append("file", e);
      image.append("cloud_name", "duxz0nau4");
      image.append("upload_preset", "moments_moment");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        image
      );
      console.log(response.data.url);
      return response.data.url;
    } catch (error) {
      console.log("imageUploaderror", error);
    }
  };

  const handleCloseModal = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.currentTarget.files;
    if (selectedFiles) {
      setPreviewFiles(Array.from(selectedFiles));
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleCloseModal);
    return () => {
      document.removeEventListener("mousedown", handleCloseModal);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div ref={modalRef} className="bg-white p-8 rounded-md max-w-md">
        <span className=" cursor-pointer" onClick={onClose}>
          &times;
        </span>
        <Formik
          initialValues={{
            description: "",
            file: null,
            visibility: "public",
          }}
          validationSchema={validationSchema}
          onSubmit={(values: any, { setSubmitting }) => {
            handleSubmit(values)
              .then(() => {
                setSubmitting(false);
              })
              .catch((error) => {
                console.error("Form submission error:", error);
                setSubmitting(false);
                // Handle the error, e.g., display error message to the user
                // You can use Formik's setError function to display errors
              });
          }}
        >
          {({ setFieldValue }) => (
            <Form>
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
                  // accept="image/*"
                  id="file"
                  name="file"
                  multiple // Add multiple attribute to select multiple files
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    // Use event.currentTarget.files to access the array of selected files
                    const selectedFiles = event.currentTarget.files;
                    if (selectedFiles) {
                      // Convert the FileList object to an array and set it as the value
                      // Assuming you only want to store the first file, you can modify this logic accordingly
                      setFieldValue("file", Array.from(selectedFiles));
                      setPreviewFiles(Array.from(selectedFiles));
                    }
                  }}
                  // onChange={handleFileChange}
                />
                <div>
                  {previewFiles.map((file, index) => (
                    <div key={index}>
                      {file.name}{" "}
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewFiles((prevFiles) =>
                            prevFiles.filter((_, i) => i !== index)
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <ErrorMessage
                  name="file"
                  component="div"
                  className="text-red-500 text-xs italic"
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
    </div>
  );
};

export default CreateMoment;
