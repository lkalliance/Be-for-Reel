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
        <div className="no-content list-member-12">no comments left</div>
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
