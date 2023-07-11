const router = require("express").Router();
const fetch = require("axios");

router.get("/api/search/:string", async (req, res) => {
  // Route to get movies by title search
  try {
    const { from, to, certificates, groups } = req.query || false;

    const today = new Date();
    const thisYear = today.getFullYear();
    let queryParams = [];
    let dateRange = "release_date=";
    dateRange += from ? `${from}-01-01,` : ",";
    dateRange += !to || to > thisYear ? `${thisYear}-12-31` : `${to}-12-31`;
    queryParams.push(dateRange);

    if (certificates) queryParams.push(`certificates=${certificates}`);
    if (groups) queryParams.push(`groups=${groups}`);

    let searchUrl = `https://imdb-api.com/API/AdvancedSearch/${process.env.IMDB_API_KEY}?title=${req.params.string}&title_type=feature&has=plot&sort=boxoffice_gross_us,desc`;
    searchUrl += queryParams.length > 0 ? `&${queryParams.join("&")}` : "";

    console.log(searchUrl);
    const options = {
      method: "GET",
      url: searchUrl,
    };

    const movieData = await fetch.request(options);
    const returnMovies = movieData.data.results;

    // clean for nc17, tv-ma, x and upcoming
    let ratedMovies = returnMovies.filter(
      (val) =>
        val.contentRating !== "NC-17" &&
        val.contentRating !== "TV-MA" &&
        val.contentRating !== "X" &&
        val.plot
    );
    // ratedMovies = ratedMovies.filter((val) => val.contentRating !== "TV-MA");
    // ratedMovies = ratedMovies.filter((val) => val.contentRating !== "X");
    // ratedMovies = ratedMovies.filter((val) => val.contentRating !== "X");

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
