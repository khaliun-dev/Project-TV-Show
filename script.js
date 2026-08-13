function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");

  for (const episode of episodeList) {
    const episodeCard = document.createElement("article");
    episodeCard.className = "episode";

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