import axios from "axios";
import { Formik } from "formik";
import { useRef, useEffect } from "react";
import * as Yup from "yup";

import { useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";

const validationSchema = Yup.object().shape({
  file: Yup.string().required("Image is required"),
});

interface CreateMemoryProps {
  onClose: () => void;
}

const CreateMemory: React.FC<CreateMemoryProps> = ({ onClose }) => {
  const { _id } = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.token);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("userId", _id);
      if (values.file) {
        formData.append("memory", values.file);
        formData.append("memoryPath", values.file.name);
      }

      const response = await axios.post(
        "http://localhost:3001/memories/creatememory",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast({
        duration: 2000,
        description: "Memory posted successfully",
      });

      onClose();
    } catch (error) {
      console.error("Error posting memory:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-md max-w-md">
        <span className="cursor-pointer" onClick={onClose}>
          &times;
        </span>
        <Formik
          initialValues={{ file: null }}
          validationSchema={validationSchema}
          onSubmit={(values: any) => handleSubmit(values)}
        >
          {({ setFieldValue, handleSubmit }) => (
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="file"
                >
                  Image
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue("file", event.currentTarget.files![0]);
                  }}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Post Memory
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateMemory;
