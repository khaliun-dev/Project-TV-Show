let currentEpisodes = [];

// Stores episodes we have already fetched
const episodeCache = new Map();

function getEpisodeCode(episode) {
  return `S${String(episode.season).padStart(2, "0")}E${String(
    episode.number,
  ).padStart(2, "0")}`;
}

// Fetch episodes for a show
async function fetchEpisodes(showId) {
  // Check if we have already fetched this show's episodes
  if (episodeCache.has(showId)) {
    return episodeCache.get(showId);
  }

  const response = await fetch(
    `https://api.tvmaze.com/shows/${showId}/episodes`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch episodes");
  }

  const episodes = await response.json();

  // Save the episodes so we don't fetch them again
  episodeCache.set(showId, episodes);

  return episodes;
}

// Add episodes to the episode selector
function populateEpisodeSelector(episodes) {
  const episodeSelector = document.getElementById("episode-selector");

  episodeSelector.innerHTML = "";

  episodes.forEach(function (episode) {
    const option = document.createElement("option");

    const episodeCode = getEpisodeCode(episode);

    option.value = episodeCode;
    option.textContent = `${episodeCode} - ${episode.name}`;

    episodeSelector.appendChild(option);
  });
}

// Display episodes on the page
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  rootElem.innerHTML = "";

  episodeList.forEach(function (episode) {
    const episodeBox = document.createElement("div");

    episodeBox.className = "episode";

    const episodeCode = getEpisodeCode(episode);

    episodeBox.id = episodeCode;

    episodeBox.innerHTML = `
      <h2>
        ${episode.name}
        <p>${episodeCode}</p>
      </h2>

      <img src="${episode.image.medium}" alt="${episode.name}">

      <p>Season ${episode.season}, Episode ${episode.number}</p>

      <p>${episode.summary || ""}</p>

      <p>Air date: ${episode.airdate}</p>

      <p>Runtime: ${episode.runtime} minutes</p>

      <a href="${episode.url}" target="_blank">
        View episode
      </a>
    `;

    rootElem.appendChild(episodeBox);
  });
}

async function setup() {
  const rootElem = document.getElementById("root");
  const showSelector = document.getElementById("show-selector");
  const episodeSelector = document.getElementById("episode-selector");
  const searchInput = document.getElementById("search-input");
  const episodeCount = document.getElementById("episode-count");

  rootElem.textContent = "Loading shows...";

  try {
    // --------------------------------
    // 1. Fetch all shows
    // --------------------------------

    const response = await fetch("https://api.tvmaze.com/shows");

    if (!response.ok) {
      throw new Error("Failed to fetch shows");
    }

    const shows = await response.json();

    // --------------------------------
    // 2. Sort shows alphabetically
    // --------------------------------

    shows.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    // --------------------------------
    // 3. Add shows to show selector
    // --------------------------------

    shows.forEach(function (show) {
      const option = document.createElement("option");

      option.value = show.id;
      option.textContent = show.name;

      showSelector.appendChild(option);
    });

    // --------------------------------
    // 4. Load the first show
    // --------------------------------

    const firstShowId = shows[0].id;

    currentEpisodes = await fetchEpisodes(firstShowId);

    populateEpisodeSelector(currentEpisodes);

    makePageForEpisodes(currentEpisodes);

    episodeCount.textContent = `Showing ${currentEpisodes.length} episodes`;

    // --------------------------------
    // 5. Show selector
    // --------------------------------

    showSelector.addEventListener("change", async function (event) {
      const showId = event.target.value;

      rootElem.textContent = "Loading episodes...";

      searchInput.value = "";

      try {
        currentEpisodes = await fetchEpisodes(showId);

        populateEpisodeSelector(currentEpisodes);

        makePageForEpisodes(currentEpisodes);

        episodeCount.textContent = `Showing ${currentEpisodes.length} episodes`;
      } catch (error) {
        rootElem.textContent =
          "Sorry, we could not load the episodes. Please try again later.";

        console.error(error);
      }
    });

    // --------------------------------
    // 6. Episode selector
    // --------------------------------

    episodeSelector.addEventListener("change", function (event) {
      searchInput.value = "";

      episodeCount.textContent = `Showing ${currentEpisodes.length} episodes`;

      makePageForEpisodes(currentEpisodes);

      const selectedEpisode = document.getElementById(event.target.value);

      if (selectedEpisode) {
        selectedEpisode.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });

    // --------------------------------
    // 7. Search
    // --------------------------------

    searchInput.addEventListener("input", function (event) {
      const searchTerm = event.target.value.toLowerCase();

      const filteredEpisodes = currentEpisodes.filter(function (episode) {
        return (
          episode.name.toLowerCase().includes(searchTerm) ||
          (episode.summary || "").toLowerCase().includes(searchTerm)
        );
      });

      episodeCount.textContent = `Showing ${filteredEpisodes.length} episodes`;

      makePageForEpisodes(filteredEpisodes);
    });
  } catch (error) {
    rootElem.textContent =
      "Sorry, we could not load the shows. Please try again later.";

    console.error(error);
  }
}

window.onload = setup;
