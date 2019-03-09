# Audio Interface Disagreement Demo

This is a relatively minimal demonstration of an interface disagreement between web-sys and native JS.

### Steps to run

1. Install dependencies
    ```npm install```
2. Start the server
    ```npm start```
3. Navigate to http://localhost:8080
4. Press the buttons, and observe which generate audio and which do not.

### Description

The four buttons implement four different processes for inputting audio data into an AudioContext. Two of them are executed in native JS event handlers, and two call into Rust-generated WASM that leverages web-sys. Two of them use `getChannelData` to get a `Float32Array` and copy data into that typed array, and two of them use `copyToChannel` to hand data to buffers.

It should be noted that some browsers don't implement `copyToChannel` (mobile safari, I'm lookin' at you), so both the native JS and the web-sys WASM versions will fail to produce audio.

**The native JS `getChannelData` version should always work. The web-sys WASM `get_channel_data` version will never work.** This is because JS' `getChannelData` returns a `Float32Array`, which points back to the `ArrayBuffer` stored in the audio buffer in  question --- modifying what is returned by `audio_buffer.GetChannelData()` will modify the state of `audio_buffer`. web-sys' `get_channel_data` returns a `Vec<f32>` -- not a `&Vec<f32>` -- so a _copy_ of the backing buffer is created --- modifying what is returned by `audio_buffer.get_channel_data().unwrap()` **will not** modify the state of `audio_buffer`.

#### Book-keeping

This project was seeded using the [`rust-webpack-template`](https://github.com/rustwasm/rust-webpack-template) as below,

    npx create-rust-webpack audio-interface-kerfuffle
    cd audio-interface-kerfuffle
    rm -rf README.md .travis.ym .bin
    git init .
