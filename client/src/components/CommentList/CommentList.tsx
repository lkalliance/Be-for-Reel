// This component renders a list of a user's comments for their profile

/* REQUIRED PROPS:
comments: the list of comments; each has...
  -- title (title of the poll commented on)
  -- urlTitle (link to the poll commented on)
  -- movie (film selected for the comment)
  -- text (text of the comment)
thisUser: is this a user looking at their own profile */

import "./CommentList.css";
import { Dispatch, SetStateAction } from "react";
import { userCommentProps, listSection } from "../../utils";
import { Comment, Pagination } from "../../components";

interface commentListProps {
  comments: userCommentProps[];
  thisUser: boolean;
  currentPage: number;
  perPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

export function CommentList({
  comments,
  thisUser,
  currentPage,
  setCurrentPage,
  perPage,
}: commentListProps) {
  const showThis = listSection(comments, currentPage, perPage);

  const handlePageSelect = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    setCurrentPage(parseInt(id.split("-")[1]));
  };

  return (
    <>
      <ul id="user-comment-list">
        {comments.length === 0 ? (
          <li className="doesnt-exist list-member-12">no comments left</li>
        ) : (
          <>
            {showThis.map((comment, index) => {
              return (
                <Comment userComm={comment} key={index} thisUser={thisUser} />
              );
            })}
          </>
        )}
      </ul>
      <Pagination
        navHandler={handlePageSelect}
        currentPage={currentPage}
        totalCount={comments.length}
        pageSize={perPage}
        siblingCount={1}
      />
    </>
  );
}
