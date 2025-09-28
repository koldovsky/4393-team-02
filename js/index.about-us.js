const musicContainer = document.querySelector(".about-us__music-container");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const audio = document.getElementById("audio");
const progress = document.querySelector(".about-us__music-progress");
const progressContainer = document.querySelector(
  ".about-us__music-progress-container"
);
const title = document.getElementById("title");
const cover = document.getElementById("cover");
const currTime = document.querySelector("#currTime");
const durTime = document.querySelector("#durTime");

const songs = [
  { name: "zayn-dusk-till-dawn" },
  { name: "imagine-dragons-warriors" },
  { name: "swims-lose-control" },
];

let songIndex = 2;

function loadSong(song) {
  audio.src = `img/about-us/${song.name}.mp3`;
  cover.src = `img/about-us/${song.name}.jpg`;
}

loadSong(songs[songIndex]);

function playSong() {
  musicContainer.classList.add("play");
  playBtn.querySelector("i.fas").classList.replace("fa-play", "fa-pause");
  audio.play();
}

function pauseSong() {
  musicContainer.classList.remove("play");
  playBtn.querySelector("i.fas").classList.replace("fa-pause", "fa-play");
  audio.pause();
}

function changeSong(direction) {
  songIndex = (songIndex + direction + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  progress.style.width = `${(currentTime / duration) * 100}%`;
}

function setProgress(e) {
  audio.currentTime = (e.offsetX / this.clientWidth) * audio.duration;
}


playBtn.addEventListener("click", () =>
  musicContainer.classList.contains("play") ? pauseSong() : playSong()
);
prevBtn.addEventListener("click", () => changeSong(-1));
nextBtn.addEventListener("click", () => changeSong(1));
progressContainer.addEventListener("click", setProgress);

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", () => changeSong(1));
