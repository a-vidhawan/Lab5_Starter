// explore.js

window.addEventListener('DOMContentLoaded', init);

function init() {
  // TODO

  const faceImg      = document.querySelector('#explore img');
  const textArea     = document.getElementById('text-to-speak');
  const voiceSelect  = document.getElementById('voice-select');
  const talkBtn      = document.querySelector('#explore button');

  const synth = window.speechSynthesis;

  /* Fill the <select> with voices when they become available */
  function populateVoiceList() {
    const voices = synth.getVoices();
    voiceSelect.innerHTML = '';                     // clear any placeholders

    voices.forEach((v, index) => {
      const option = document.createElement('option');
      option.value  = index;                       // store array index
      option.textContent = `${v.name} (${v.lang})`;
      if (v.default) option.textContent += ' — DEFAULT';
      voiceSelect.appendChild(option);
    });
  }
  populateVoiceList();
  if (typeof synth.onvoiceschanged !== 'undefined') {
    synth.onvoiceschanged = populateVoiceList;
  }

  /* ─────────────────── Talk button ─────────────────── */
  talkBtn.addEventListener('click', () => {
    const text = textArea.value.trim();
    if (!text) return;                             // nothing to say

    const utterance = new SpeechSynthesisUtterance(text);

    /* Apply selected voice (if any) */
    const voices = synth.getVoices();
    const chosenIdx = Number(voiceSelect.value);
    if (!Number.isNaN(chosenIdx) && voices[chosenIdx]) {
      utterance.voice = voices[chosenIdx];
    }

    /* Face animation */
    utterance.addEventListener('start', () => {
      faceImg.src = 'assets/images/smiling-open.png';
    });
    utterance.addEventListener('end', () => {
      faceImg.src = 'assets/images/smiling.png';
    });

    synth.speak(utterance);
  });
}
