const router = require("express").Router();
const fetch = require("axios");

router.get("/api/search/:string", async (req, res) => {
  // Route to get movies by title search
  try {
    const { from, to, certificates, groups, runtime } = req.query || false;

    const today = new Date();
    const thisYear = today.getFullYear();
    let queryParams = [];

    // build the date range parameter
    let dateRange = "release_date=";
    dateRange += from ? `${from}-01-01,` : ",";
    dateRange += !to || to > thisYear ? `${thisYear}-12-31` : `${to}-12-31`;
    queryParams.push(dateRange);

    // build the movie rating and Best Picture winner parameters
    if (certificates) queryParams.push(`certificates=${certificates}`);
    if (groups) queryParams.push(`groups=${groups}`);
    if (runtime) queryParams.push(`runtime=${runtime}`);

    let searchUrl = `https://imdb-api.com/API/AdvancedSearch/${
      process.env.IMDB_API_KEY
    }?${
      req.params.string === "noTitle" ? "" : `title=${req.params.string}&`
    }title_type=feature&num_votes=5000,has=plot&sort=boxoffice_gross_us,desc`;
    searchUrl += queryParams.length > 0 ? `&${queryParams.join("&")}` : "";

    console.log(searchUrl);

    const options = {
      method: "GET",
      url: searchUrl,
    };

    const movieData = await fetch.request(options);
    const returnMovies = movieData.data.results;

    // clean results for nc17, tv-ma, x and upcoming
    let ratedMovies = returnMovies.filter(
      (val) =>
        val.contentRating !== "NC-17" &&
        val.contentRating !== "TV-MA" &&
        val.contentRating !== "X" &&
        val.plot
    );

    res.status(200).json(ratedMovies);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/api/info/:id", async (req, res) => {
  // Route to get specific movie data
  try {
    const movie = {
      method: "GET",
      url: `https://imdb-api.com/en/API/Title/${process.env.IMDB_API_KEY}/${req.params.id}/Trailer,Ratings,Wikipedia`,
    };

    const movieData = await fetch.request(movie);
    res.status(200).json(movieData.data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
