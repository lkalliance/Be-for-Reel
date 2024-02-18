// This component renders a user profile page

import "./Profile.css";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import axios from "axios";
import { AuthService } from "../../utils/auth";
import { QUERY_SINGLE_USER } from "../../utils/queries";
import { NEW_CODE } from "../../utils/mutations";
import {
  PollList,
  CommentList,
  Tabs,
  EmailVerifyModal,
} from "../../components";

export function Profile() {
  const auth = new AuthService();
  const {
    lookupName: whoIsThis,
    confirmed,
    email,
    _id: user_id,
  } = auth.getProfile();
  const { username } = useParams();
  const thisUser = whoIsThis === username;
  const [whichTab, setTab] = useState("polls");
  const [newCodeSent, setNewCodeSent] = useState(false);
  const [currentPollPage, setCurrentPollPage] = useState(1);
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const perPage = 10;

  const { data } = useQuery(QUERY_SINGLE_USER, {
    variables: { lookupname: username },
  });

  const [newEmailCode, { error }] = useMutation(NEW_CODE);

  const userData = data?.getUser || {};
  const createdOn = new Date(userData.created);

  const closeModal = () => {
    try {
      setNewCodeSent(false);
    } catch (err) {
      console.log(err);
    }
  };

  const tabHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget;
    if (id === "polls" || id === "comments") setTab(id);
  };

  const resendHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // handler to re-send verification link

    // if there is no email, never mind
    if (!email || !user_id || email.length === 0 || user_id.length === 0)
      return;

    try {
      // request new code if needed
      const newCode = await newEmailCode({
        variables: {
          user_id,
          email,
        },
      });

      if (newCode.data.newEmailCode.success) {
        // if the operation succeeded, pass it along to the email API
        await axios.post("/api/email/validate-send", {
          email,
        });
      }
      console.log(newCode.data?.newEmailCode.message);
      setNewCodeSent(true);
    } catch (err) {
      console.log(error);
    }
  };

  return (
    <>
      <section id="profile">
        {userData.created ? (
          // the user exists, render their data
          <>
            <h1 className="col col-12">{userData.userName}</h1>
            <h4
              className={`col col-12${thisUser ? " you-data" : " user-data"}`}
            >{`member since ${createdOn.getFullYear()}`}</h4>
            {!confirmed && thisUser && (
              <div className="alert alert-danger">
                Account not yet activated. Check <strong>{email}</strong> for
                confirmation email.{" "}
                <button id="resend" onClick={resendHandler}>
                  resend
                </button>
              </div>
            )}
            <Tabs
              list={["polls", "comments"]}
              current={whichTab}
              handler={tabHandler}
            />
            {userData && whichTab === "polls" && (
              <PollList
                polls={userData.polls}
                thisUser={thisUser}
                uName={username}
                currentPage={currentPollPage}
                setCurrentPage={setCurrentPollPage}
                perPage={perPage}
              />
            )}
            {userData && whichTab === "comments" && (
              <CommentList
                comments={userData.comments}
                thisUser={thisUser}
                currentPage={currentCommentPage}
                setCurrentPage={setCurrentCommentPage}
                perPage={perPage}
              />
            )}
          </>
        ) : (
          // the user doesn't exist, tell the user so
          <div className="doesnt-exist list-member-20">
            The user <span>{username}</span> does not exist.
          </div>
        )}
      </section>
      {newCodeSent && (
        <EmailVerifyModal
          close={closeModal}
          email={email.length > 0 ? email : "the provided email address"}
        />
      )}
    </>
  );
}
