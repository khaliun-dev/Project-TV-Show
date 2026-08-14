let allEpisodes = [];

function setup() {
  allEpisodes = getAllEpisodes();

  makePageForEpisodes(allEpisodes);

  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredEpisodes = allEpisodes.filter(function (episode) {
      return (
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
      );
    });

    makePageForEpisodes(filteredEpisodes);
  });
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  // Clear the old episodes
  rootElem.innerHTML = "";

  // Update episode count
  const episodeCount = document.getElementById("episodeCount");
  episodeCount.textContent = `${episodeList.length} / ${allEpisodes.length} Episodes`;

  for (const episode of episodeList) {
    const episodeCard = document.createElement("article");
    episodeCard.className = "episodes";

    const title = document.createElement("h2");
    title.textContent = episode.name;

    const season = String(episode.season).padStart(2, "0");
    const number = String(episode.number).padStart(2, "0");

    const episodeCode = document.createElement("p");
    episodeCode.textContent = `S${season}E${number}`;

    const image = document.createElement("img");
    image.src = episode.image.medium;
    image.alt = episode.name;

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary;

    episodeCard.appendChild(title);
    episodeCard.appendChild(episodeCode);
    episodeCard.appendChild(image);
    episodeCard.appendChild(summary);

    rootElem.appendChild(episodeCard);
  }
}

window.onload = setup;
