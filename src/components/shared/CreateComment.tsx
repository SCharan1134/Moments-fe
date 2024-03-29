import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { addComment } from "../../state/index";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useDispatch, useSelector } from "react-redux";

const CreateCommentSchema = Yup.object().shape({
  comment: Yup.string()
    .min(2, "Comment must be at least 2 characters")
    .max(255, "Comment must be at most 255 characters")
    .required("Comment is required"),
});

interface CreateCommentProps {
  userId: string;
  commentId: string;
  mommentId: string;
  isReply?: Boolean;
  username?: string;
  setIsReply: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateComment: React.FC<CreateCommentProps> = ({
  userId,
  isReply = false,
  commentId,
  mommentId,
  username,
  setIsReply,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.token);
  const user = useSelector((state: any) => state.user);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (
    values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      // const userid = userId;
      formData.append("description", values.comment);
      if (isReply) {
        // formData.append("commentId", commentId);
        console.log(`http://localhost:3001/comments/${commentId}/reply`);
        const response = await axios.post(
          `http://localhost:3001/comments/${commentId}/reply`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        setIsReply(false);
      } else {
        // formData.append("momentId", "66041e490338021c6c9b2c61");
        const response = await axios.post(
          `http://localhost:3001/comments/${mommentId}/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(response);
        const newComment = {
          ...response.data,
          userName: user.userName,
          avatarPath: user.avatarPath,
        };
        dispatch(addComment({ comment: newComment }));
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Formik
      initialValues={{
        comment: username ? `@${username} ` : "",
      }}
      validationSchema={CreateCommentSchema}
      onSubmit={(values: any, { resetForm }: { resetForm: () => void }) => {
        handleSubmit(values, { resetForm });
      }}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <div className="w-full flex mt-5 rounded-xl border-b border-primary ">
            <Button
              className="bg-secondary  hover:bg-secondary"
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              😊
            </Button>
            {showEmojiPicker && (
              <div className="absolute bottom-0 right-0 " ref={emojiPickerRef}>
                {/* <Picker/> */}
                <Picker
                  data={data}
                  onEmojiSelect={(emoji: any) => {
                    setFieldValue("comment", values.comment + emoji.native); // Append emoji to the existing comment value
                    setShowEmojiPicker(false);
                  }}
                />
              </div>
            )}
            <Field
              type="text"
              id="comment"
              name="comment"
              className={`bg-secondary w-full  `}
              placeholder="Add a comment..."
            />

            <Button
              type="submit"
              className="bg-secondary text-primary hover:bg-secondary hover:opacity-75"
            >
              post
            </Button>
          </div>
          <ErrorMessage
            name="comment"
            component="div"
            className="text-red-500 mt-1"
          />
        </Form>
      )}
    </Formik>
  );
};

export default CreateComment;
