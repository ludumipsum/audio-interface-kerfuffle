let wasm = {}
const play_js_button = document.getElementById("play_js")
const play_wasm1_button = document.getElementById("play_wasm1")
const play_wasm2_button = document.getElementById("play_wasm2")

import("../crate/pkg")
  .then(w => {
    console.log("WASM loaded, ready to play")
    wasm = w
    play_js_button.removeAttribute("disabled")
    play_wasm1_button.removeAttribute("disabled")
    play_wasm2_button.removeAttribute("disabled")
  })
  .catch(err => {
    console.error("Failed to load WASM:", err)
  })

play_js_button.addEventListener("click", _ => {
  js_play_audio_getChannelData()
})

play_wasm1_button.addEventListener("click", _ => {
  wasm.play_audio_get_channel_data()
})

play_wasm2_button.addEventListener("click", _ => {
  wasm.play_audio_copy_to_channel()
})

function js_play_audio_getChannelData() {
  let audio = wasm.get_audio()
  let ctx = new AudioContext();

  let buffer = ctx.createBuffer(2, audio.length, 44100)
  let left_channel = buffer.getChannelData(0)
  let right_channel = buffer.getChannelData(1)

  for (let i = 0; i < audio.length; i++) {
    left_channel[i] = audio[i]
    right_channel[i] = audio[i]
  }

  let source = ctx.createBufferSource()
  source.buffer = buffer
  source.connect(ctx.destination)
  source.start()
}
