// This component renders a list of a user's comments for their profile

/* REQUIRED PROPS:
comments: the list of comments; each has...
  -- title (title of the poll commented on)
  -- urlTitle (link to the poll commented on)
  -- movie (film selected for the comment)
  -- text (text of the comment)
thisUser: is this a user looking at their own profile */

import "./CommentList.css";
import { userCommentProps } from "../../utils";
import { Comment } from "../../components";

interface commentListProps {
  comments: userCommentProps[];
  thisUser: boolean;
}

export function CommentList({ comments, thisUser }: commentListProps) {
  return (
    <div id="user-comment-list">
      {comments.length === 0 ? (
        <div className="doesnt-exist list-member-12">no comments left</div>
      ) : (
        <>
          {comments.map((comment, index) => {
            return (
              <Comment userComm={comment} key={index} thisUser={thisUser} />
            );
          })}
        </>
      )}
    </div>
  );
}
