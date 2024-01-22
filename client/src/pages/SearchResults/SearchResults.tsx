import "./SearchResults.css";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_SEARCH } from "../../utils/queries";
import { userProps, userPollProps } from "../../utils";
import { UsernameLink, Tabs } from "../../components";

export function SearchResults() {
  const term = useParams();
  const [panel, setPanel] = useState("users");

  const handleSwitch = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget;
    setPanel(id);
  };

  // get the relevant polls
  const getResults = useQuery(QUERY_SEARCH, {
    variables: { term: term.term },
  });

  const users: userProps[] = getResults.data?.getSearch.users.users || [];
  const polls: userPollProps[] = getResults.data?.getSearch.polls.polls || [];

  return (
    <section id="search-results">
      <h3>search for: {`"${term.term}"`}</h3>
      <Tabs list={["users", "polls"]} current={panel} handler={handleSwitch} />
      {panel === "users" && (
        <>
          {users.map((user, index) => {
            return <UsernameLink key={index} username={user.userName} />;
          })}
        </>
      )}
      {panel === "polls" && (
        <>
          {polls.map((poll, index) => {
            return <Link to={poll.urlTitle}>{poll.title}</Link>;
          })}
        </>
      )}
    </section>
  );
}
