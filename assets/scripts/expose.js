// expose.js

window.addEventListener('DOMContentLoaded', init);

function init() {
  // TODO
  
  const hornSelect   = document.getElementById('horn-select');
  const hornImg      = document.querySelector('#expose > img');
  const audioElem    = document.querySelector('#expose audio');

  const volumeSlider = document.getElementById('volume');
  const volumeIcon   = document.querySelector('#volume-controls img');

  const honkBtn = document.querySelector('#expose button');

  const jsConfetti = new JSConfetti();  // lib is loaded in HTML

  const HORN_DATA = {
    'air-horn'  : { img: 'assets/images/air-horn.svg',  audio: 'assets/audio/air-horn.mp3'  },
    'car-horn'  : { img: 'assets/images/car-horn.svg',  audio: 'assets/audio/car-horn.mp3'  },
    'party-horn': { img: 'assets/images/party-horn.svg',audio: 'assets/audio/party-horn.mp3'}
  };

  /* Horn <select> */
  hornSelect.addEventListener('change', function(){
    const choice = hornSelect.value;
    if (!HORN_DATA[choice]) return;          // ignore default option
    const { img, audio } = HORN_DATA[choice];
    hornImg.src = img;
    hornImg.alt = `${choice.replace('-', ' ')} image`;
    audioElem.src = audio;
    audioElem.load();                      // reload audio element
  });

  /* Honk button */
  honkBtn.addEventListener('click', function() {
    //function.preventDefault();                     // if inside a <form>
    if (honkBtn.disabled) return;

    audioElem.currentTime = 0;
    audioElem.play();

    if (hornSelect.value === 'party-horn') {
      jsConfetti.addConfetti();
    }
  });

  /* helper → volume‑level icon */
  function chooseVolumeIcon(vol) {
    if (vol === 0)       return 0;
    if (vol <   34)      return 1;   // 1‑33
    if (vol <   67)      return 2;   // 34‑66
    return 3;                         // 67‑100
  }

  function applyVolume(vol) {
    const clamped = Math.max(0, Math.min(100, Number(vol)));
    volumeSlider.value = clamped;

    audioElem.volume = clamped / 100;

    const lvl = chooseVolumeIcon(clamped);
    volumeIcon.src = `assets/icons/volume-level-${lvl}.svg`;
    volumeIcon.alt = `Volume level ${lvl}`;

    honkBtn.disabled = clamped === 0;     // spec: disable at volume 0
  }

  /* Volume slider and (optional) number box stay in sync */
  volumeSlider.addEventListener('input', () => applyVolume(Number(volumeSlider.value)));
  
  applyVolume(Number(volumeSlider.value));         // match slider’s default (50)

}