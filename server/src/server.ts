
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

console.log("Working directory:", process.cwd());
console.log(
  "TMDB token loaded:",
  Boolean(process.env.TMDB_ACCESS_TOKEN),
);

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const TMDB_ACCESS_TOKEN =
  process.env.TMDB_ACCESS_TOKEN;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    tmdbConfigured: Boolean(TMDB_ACCESS_TOKEN),
  });
});

/**
 * Search TMDB for movies.
 *
 * Example:
 * GET /api/media/search/movie?q=Alien
 */
app.get("/api/media/search/movie", async (req, res) => {
  try {
    const query = String(req.query.q ?? "").trim();

    if (!query) {
      return res.status(400).json({
        error: "A search query is required.",
      });
    }

    if (!TMDB_ACCESS_TOKEN) {
      return res.status(500).json({
        error: "TMDB_ACCESS_TOKEN is not configured.",
      });
    }

    const url = new URL(
      "https://api.themoviedb.org/3/search/movie",
    );

    url.searchParams.set("query", query);
    url.searchParams.set("include_adult", "false");
    url.searchParams.set("language", "en-US");
    url.searchParams.set("page", "1");

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "TMDB search failed:",
        response.status,
        errorText,
      );

      return res.status(response.status).json({
        error: "TMDB search failed.",
      });
    }

    const data = await response.json();

    const results = Array.isArray(data.results)
      ? data.results
          .slice(0, 5)
          .map((movie: any) => ({
            externalId: movie.id,
            title:
              movie.title ??
              movie.original_title ??
              "",
            releaseDate:
              movie.release_date ?? "",
            year: movie.release_date
              ? Number(
                  movie.release_date.slice(0, 4),
                )
              : null,
            description:
              movie.overview ?? "",
            posterPath:
              movie.poster_path ?? null,
            backdropPath:
              movie.backdrop_path ?? null,
            posterImage: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null,
            backdropImage:
              movie.backdrop_path
                ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
                : null,
          }))
      : [];

    return res.json({
      source: "tmdb",
      results,
    });
  } catch (error) {
    console.error(
      "Unexpected TMDB search error:",
      error,
    );

    return res.status(500).json({
      error: "Unexpected server error.",
    });
  }
});


/**
 * Get detailed TMDB movie information.
 *
 * Example:
 * GET /api/media/movie/550
 */
app.get("/api/media/movie/:id", async (req, res) => {
  try {
    const movieId = req.params.id;

    if (!TMDB_ACCESS_TOKEN) {
      return res.status(500).json({
        error: "TMDB_ACCESS_TOKEN is not configured.",
      });
    }

    const url = new URL(
      `https://api.themoviedb.org/3/movie/${encodeURIComponent(
        movieId,
      )}`,
    );

    url.searchParams.set("language", "en-US");
    url.searchParams.set(
      "append_to_response",
      "credits,videos,images",
    );

    url.searchParams.set(
      "include_image_language",
      "en,null",
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "TMDB detail lookup failed:",
        response.status,
        errorText,
      );

      return res.status(response.status).json({
        error: "TMDB detail lookup failed.",
      });
    }

    const movie = await response.json();

    const directors =
      movie.credits?.crew
        ?.filter(
          (person: any) =>
            person.job === "Director",
        )
        ?.map(
          (person: any) => person.name,
        ) ?? [];

    const cast =
      movie.credits?.cast
        ?.slice(0, 10)
        ?.map(
          (person: any) => person.name,
        ) ?? [];

    const genres =
      movie.genres?.map(
        (genre: any) => genre.name,
      ) ?? [];

    return res.json({
      source: "tmdb",

      externalId: movie.id,

      title:
        movie.title ??
        movie.original_title ??
        "",

      originalTitle:
        movie.original_title ?? "",

      year: movie.release_date
        ? Number(
            movie.release_date.slice(0, 4),
          )
        : null,

      releaseDate:
        movie.release_date ?? null,

      description:
        movie.overview ?? "",

      runtime:
        movie.runtime ?? null,

      rating:
        typeof movie.vote_average === "number"
          ? movie.vote_average
          : null,

      genres,

      posterImage: movie.poster_path
        ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
        : null,

      backdropImage:
        movie.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
          : null,

      directors,

      cast,

      productionCompanies:
        movie.production_companies?.map(
          (company: any) => company.name,
        ) ?? [],

      countries:
        movie.production_countries?.map(
          (country: any) =>
            country.name,
        ) ?? [],

      languages:
        movie.spoken_languages?.map(
          (language: any) =>
            language.english_name ??
            language.name,
        ) ?? [],

      videos:
        movie.videos?.results
          ?.slice(0, 10)
          ?.map((video: any) => ({
            key: video.key,
            name: video.name,
            site: video.site,
            type: video.type,
          })) ?? [],

      images: {
        posters:
          movie.images?.posters?.slice(0, 10)
            ?.map((image: any) => ({
              filePath:
                image.file_path,
              width: image.width,
              height: image.height,
              url: `https://image.tmdb.org/t/p/w780${image.file_path}`,
            })) ?? [],

        backdrops:
          movie.images?.backdrops
            ?.slice(0, 10)
            ?.map((image: any) => ({
              filePath:
                image.file_path,
              width: image.width,
              height: image.height,
              url: `https://image.tmdb.org/t/p/w1280${image.file_path}`,
            })) ?? [],

        logos:
          movie.images?.logos
            ?.slice(0, 10)
            ?.map((image: any) => ({
              filePath:
                image.file_path,
              width: image.width,
              height: image.height,
              url: `https://image.tmdb.org/t/p/w500${image.file_path}`,
            })) ?? [],
      },

      credits: {
        directors,
        cast,
      },
    });
  } catch (error) {
    console.error(
      "Unexpected TMDB detail error:",
      error,
    );

    return res.status(500).json({
      error: "Unexpected server error.",
    });
  }
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `MediaLibrary API running on port ${PORT}`,
  );
});