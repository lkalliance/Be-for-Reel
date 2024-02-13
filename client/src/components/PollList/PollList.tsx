// This component renders a list of polls

/* REQUIRED PROPS:
polls: the array of poll objects to list
thisUser: boolean flag, are we looking at the current user's profile?
uName: username of the current user (for refetch query after deactivation) */

import "./PollList.css";
import { AuthService } from "../../utils/auth";
import { pollListProps } from "../../utils/interfaces";
import { useMutation } from "@apollo/client";
import { DEACTIVATE_POLL } from "../../utils/mutations";
import { QUERY_ALL_POLLS, QUERY_SINGLE_USER, listSection } from "../../utils";
import { PollListing, Pagination } from "../../components/";

export function PollList({
  polls,
  thisUser,
  uName,
  currentPage,
  setCurrentPage,
  perPage,
}: pollListProps) {
  const auth = new AuthService();
  const showThis = listSection(polls, currentPage, perPage);

  const [deactivatePoll] = useMutation(DEACTIVATE_POLL, {
    refetchQueries: () => [
      {
        query: QUERY_ALL_POLLS,
        variables: { username: "" },
      },
      {
        query: QUERY_SINGLE_USER,
        variables: { lookupname: uName },
      },
    ],
  });

  const cancelPoll = async (e: React.MouseEvent<HTMLElement>) => {
    // this handler deactivates a poll
    e.preventDefault();
    const id = e.currentTarget.dataset.id;
    try {
      const updatedPoll = await deactivatePoll({
        variables: {
          poll_id: id,
        },
      });
      console.log(updatedPoll);
      // after creating, update user with newly created poll
      auth.login(updatedPoll.data?.deactivatePoll.token.token);
    } catch (err: any) {
      console.log(err);
    }
  };

  const editPoll = async (e: React.MouseEvent<HTMLElement>) => {
    // this handler sets to edit a poll
    e.preventDefault();
    const id = e.currentTarget.dataset.id;
    try {
      console.log(`Editing poll ${id}`);
    } catch (err: any) {
      console.log(err);
    }
  };

  const handlePageSelect = (e: React.MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    const { id } = e.currentTarget;
    setCurrentPage(parseInt(id.split("-")[1]));
  };

  return (
    <>
      <ul id="user-poll-list">
        {polls.length === 0 ? (
          <li className="doesnt-exist list-member-12">no polls created</li>
        ) : (
          <>
            {showThis.map((poll, index) => {
              return (
                <PollListing
                  user={{ poll, thisUser, editPoll, cancelPoll }}
                  key={index}
                />
              );
            })}
          </>
        )}
      </ul>
      <Pagination
        navHandler={handlePageSelect}
        currentPage={currentPage}
        totalCount={polls.length}
        pageSize={perPage}
        siblingCount={1}
      />
    </>
  );
}
