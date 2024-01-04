import "./FAQ.css";

export function FAQ() {
  return (
    <section id="FAQ">
      <h1>FAQ</h1>
      <dl>
        <dt>How do I vote in a poll?</dt>
        <dd>
          <p>
            Click or tap on the appropriate poll, either on the poll directory
            page or on a user page. Click or tap the <span>select</span> button
            for the film you'd like to vote for, and then click or tap the{" "}
            <span>Vote!</span> button.
          </p>
          <p>You must be logged in with your free account to vote in a poll.</p>
        </dd>
        <dt>How do I leave a comment on a poll?</dt>
        <dd>
          <p>
            You may leave a comment with your vote. After selecting a film,
            before clicking the <span>Vote!</span> button, leave a comment in
            the text field above it. There is no commenting feature on polls
            outside of leaving your comment with your vote.
          </p>
        </dd>
        <dt>Is there a limit to how many polls I can vote on?</dt>
        <dd>
          <p>
            There isn't! You may only vote once on each poll, and you may only
            vote in unexpired polls, but otherwise you may vote on as many as
            you wish!
          </p>
        </dd>
        <dt>How do I see a poll's results?</dt>
        <dd>
          <p>
            Once you have voted in a poll, you can see the current results. Once
            a poll has expired, you can see the end results, whether or not you
            have voted in the poll.
          </p>
          <p>
            You must be logged in with your free account to see a poll's results
            and comments.
          </p>
        </dd>
        <dt>How do I create a poll?</dt>
        <dd>
          <p>
            Click on the <span>Create</span> link in the main navigation, which
            appears only when you are logged in with your free account. Populate
            your poll with the movies of your choosing by searching titles, and
            clicking or tapping on the search results you wish to include.
            Remove films from the poll by clicking or tapping on them in the
            list of selected films.
          </p>
          <p>
            Give your poll a name and optionally a description. Optionally
            choose a genre with which to tag your poll. Then click the{" "}
            <span>Create</span> button!
          </p>
        </dd>

        <dt>
          Is there a limit to the number of films I can include in my poll?
        </dt>
        <dd>
          <p>You may list up to 12 films in any poll you create.</p>
        </dd>

        <dt>
          Why is the <span>Search for films</span> button disabled on the Create
          a Poll page?
        </dt>
        <dd>
          <p>
            You need to have enough specificity in your search terms. Provide a
            title, and/or use at least three different search options to
            activate the search button.
          </p>
        </dd>

        <dt>Why is the movie I want not appearing in the search results?</dt>
        <dd>
          <p>
            Search results are limited to films that have received at least
            1,000 user votes on{" "}
            <a href="https://www.imdb.com" target="_blank" rel="noreferrer">
              imdB
            </a>{" "}
            and at least have an editorially-supplied plot. X-rated and
            NC-17-rated films are not shown in search results.
          </p>
        </dd>

        <dt>How do I list my poll in the genre I want?</dt>
        <dd>
          <p>
            Polls are listed with genres based on the genres assigned to them by{" "}
            <a href="https://www.imdb.com" target="_blank" rel="noreferrer">
              imdB
            </a>
            . Your poll will be automatically listed with any genre that is
            shared by all movies in your poll. In addition, you can add a
            listing of your choice from among all genres that appear for at
            least half of your selected films.
          </p>
        </dd>

        <dt>Can I edit my poll once I've created it?</dt>
        <dd>
          <p>A the present time you cannot.</p>
        </dd>

        <dt>How long is a poll active?</dt>
        <dd>
          <p>Each poll is active for 30 days after its creation.</p>
        </dd>

        <dt>How many polls can I create?</dt>
        <dd>
          <p>
            The overall number of polls you can create is unlimited. However,
            you can only have a maximum of 30 polls active at any given time
            (essentially one per day). If you have reached that maximum, you
            will have to wait for one of your polls to expire before you can
            create another one.
          </p>
        </dd>
      </dl>
    </section>
  );
}
