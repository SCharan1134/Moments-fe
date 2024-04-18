import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import { changeUserDetails } from "@/state";
import { CgProfile } from "react-icons/cg";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  const [imagePreview, setImagePreview] = useState<any>(null);
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

      const imgUrl = await uploadImage(values.file);

      formData.append("avatarPath", imgUrl);
      console.log(...formData);

      const response = await axios.post(
        `http://localhost:3001/users/updateuser/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
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

  const uploadImage = async (e: any) => {
    try {
      const image = new FormData();
      const cloudName = "duxz0nau4";
      image.append("file", e);
      image.append("cloud_name", "duxz0nau4");
      image.append("upload_preset", "moments_avatars");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        image
      );
      return response.data.url;
    } catch (error) {
      console.log("imageUploaderror", error);
    }
  };

  const { avatarPath, userName } = useSelector((state: any) => state.user);

  return (
    <div className=" bg-secondary h-full text-white">
      <div className=" py-5 flex h-[675px]">
        <div className="border border-[#474748] p-4 flex flex-col h-full bg-moment rounded-xl  w-[273px]">
          <div className="text-2xl font-semibold">Settings</div>
          <div className="flex flex-col py-5 px-3">
            <div className="text-xl flex items-center gap-3">
              <span>
                <CgProfile />
              </span>{" "}
              Edit profile
            </div>
          </div>
        </div>
        <div className="mx-5 border w-full rounded-2xl border-[#474748] p-4 pr-10 bg-moment flex flex-col">
          <h2 className="font-bold text-2xl mb-5">Edit Profile</h2>
          <Formik
            initialValues={{ userName: "", file: null }}
            validationSchema={validationSchema}
            onSubmit={(values: any, { resetForm }: any) => {
              handleSubmit(values, { resetForm });
            }}
          >
            {({ setFieldValue }) => (
              <Form className="p-24">
                <div className="w-full justify-between items-center border border-[#474748] rounded-xl mx-2 flex gap-10 cursor-pointer p-2 bg-[#363536] mb-5">
                  <Avatar className="">
                    {imagePreview === null ? (
                      <AvatarImage
                        src={avatarPath}
                        className="rounded-full h-20 w-20 object-cover bg-white"
                      />
                    ) : (
                      <AvatarImage
                        src={imagePreview}
                        className="rounded-full h-20 w-20 object-cover bg-white"
                      />
                    )}

                    <AvatarFallback className="rounded-full h-10 w-10 bg-slate-400  p-2">
                      {userName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    accept="image/*"
                    id="file"
                    name="file"
                    className="block text-sm text-slate-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-xl file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-primary file:text-white
                                  hover:file:bg-red-400 marker:text-secondary"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setImagePreview(
                        URL.createObjectURL(event.currentTarget.files![0])
                      );
                      setFieldValue("file", event.currentTarget.files![0]);
                    }}
                  />
                </div>
                <div className="p-2 flex flex-col gap-5 items-end">
                  <Field
                    type="text"
                    id="userName"
                    name="userName"
                    className="bg-[#363536] border-[#494949] text-[#8B8B8B] py-2 px-5 w-full rounded-lg focus:outline-none"
                    placeholder="Username"
                  />
                  <button
                    type="submit"
                    className="w-52 bg-primary text-white py-2 px-4 rounded-md hover:bg-slate-400  transition-all"
                  >
                    Submit
                  </button>
                </div>
                <div className="w-full flex items-end bg-secondary justify-end mr-10"></div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Settings;
