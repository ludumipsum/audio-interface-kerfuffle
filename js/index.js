let wasm = {}
const play_js_button = document.getElementById("play_js")
const play_wasm_button = document.getElementById("play_wasm")

import("../crate/pkg")
  .then(w => {
    console.log("WASM loaded, ready to play")
    wasm = w
    play_js_button.removeAttribute("disabled")
    play_wasm_button.removeAttribute("disabled")
  })
  .catch(err => {
    console.error("Failed to load WASM:", err)
  })

play_js_button.addEventListener("click", _ => {
  console.log("Playing audio from js...")
  js_play_audio()
})

play_wasm_button.addEventListener("click", _ => {
  console.log("Playing audio from wasm...")
  wasm.play_audio()
})

function js_play_audio() {
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
