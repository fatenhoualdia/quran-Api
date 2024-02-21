const apiUrl = "https://mp3quran.net/api/v3";

const language = "ar";

async function getReciters() {
  const chooseReciter = document.querySelector("#chooseReciter");
  const res = await fetch(`${apiUrl}/reciters?language=${language}`);
  const data = await res.json();
  chooseReciter.innerHTML = `<option> اختر القارئ</option>`;
  data.reciters.forEach(
    (reciter) =>
      (chooseReciter.innerHTML += `<Option value="${reciter.id}"> ${reciter.name}</Option>`)
  );
  chooseReciter.addEventListener("change", (e) => getMushaf(e.target.value));
}
getReciters();

async function getMushaf(reciter) {
  const chooseMoshaf = document.querySelector("#chooseMoshaf");

  console.log(reciter);
  const res = await fetch(
    `${apiUrl}/reciters?language=${language}&reciter=${reciter}`
  );
  const data = await res.json();
  const moshafs = data.reciters[0].moshaf;

  chooseMoshaf.innerHTML = `<Option value="" data-server="" data-SurahList="">اختر المصحف</Option>`;
  moshafs.forEach((moshaf) => {
    chooseMoshaf.innerHTML += `<Option value="${moshaf.id}"
     data-server="${moshaf.server}"
     data-SurahList="${moshaf.surah_list}">
     ${moshaf.name}
     </Option>`;
  });

  chooseMoshaf.addEventListener("change", (e) => {
    const selectedMoshaf = chooseMoshaf.options[chooseMoshaf.selectedIndex];
    const surahServer = selectedMoshaf.dataset.server;
    const surahList = selectedMoshaf.dataset.surahlist;

    getSurah(surahServer, surahList);
  });
}

async function getSurah(surahServer, surahList) {
  const chooseSurah = document.querySelector("#chooseSurah");
  console.log(surahServer);
  const res = await fetch(`https://mp3quran.net/api/v3/suwar`);
  const data = await res.json();
  const surahNames = data.suwar;

  surahList = surahList.split(",");

  chooseSurah.innerHTML = `<option value="">اختر السورة <option>`;

  surahList.forEach((surah) => {
    const padSurah = surah.padStart(3, "0");
    surahNames.forEach((surahName) => {
      if (surahName.id.toString() === surah) {
        chooseSurah.innerHTML += `<option value="${surahServer}${padSurah}.mp3">${surahName.name}</option>`;
      }
    });
  });

  chooseSurah.addEventListener("change", (e) => {
    const selectedSurah = chooseSurah.options[chooseSurah.selectedIndex];
    playSurah(selectedSurah.value);
  });
}

function playSurah(surahM3) {
  const audioPlayer = document.querySelector("#audioPlayer");
  audioPlayer.src = surahM3; // Corrected variable name here
  audioPlayer.play();
}

function playLive(channel) {
  if (Hls.isSupported()) {
    var video = document.getElementById('liveVideo');
    var hls = new Hls();
    hls.loadSource(`${channel}`);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
  }
}
