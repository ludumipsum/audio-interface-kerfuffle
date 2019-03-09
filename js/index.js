let wasm = {}
const js_getChannelData = document.getElementById("js_getChannelData")
const js_copyToChannel = document.getElementById("js_copyToChannel")
const wasm_get_channel_data = document.getElementById("wasm_get_channel_data")
const wasm_copy_to_channel = document.getElementById("wasm_copy_to_channel")

import("../crate/pkg")
  .then(w => {
    console.log("WASM loaded, ready to play")
    wasm = w
    js_getChannelData.removeAttribute("disabled")
    js_copyToChannel.removeAttribute("disabled")
    wasm_get_channel_data.removeAttribute("disabled")
    wasm_copy_to_channel.removeAttribute("disabled")
  })
  .catch(err => {
    console.error("Failed to load WASM:", err)
  })

js_getChannelData.addEventListener("click", _ => {
  js_playAudio_getChannelData()
})
js_copyToChannel.addEventListener("click", _ => {
  js_play_audio_copyToChannel()
})
wasm_get_channel_data.addEventListener("click", _ => {
  wasm.play_audio_get_channel_data()
})
wasm_copy_to_channel.addEventListener("click", _ => {
  wasm.play_audio_copy_to_channel()
})

function js_playAudio_getChannelData() {
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

function js_play_audio_copyToChannel() {
  let audio = wasm.get_audio()
  let ctx = new AudioContext();

  let buffer = ctx.createBuffer(2, audio.length, 44100)
  buffer.copyToChannel(audio, 0)
  buffer.copyToChannel(audio, 1)

  let source = ctx.createBufferSource()
  source.buffer = buffer
  source.connect(ctx.destination)
  source.start()
}
