#[macro_use]
extern crate cfg_if;
extern crate web_sys;
extern crate wasm_bindgen;
extern crate serde;
extern crate serde_json;

use wasm_bindgen::prelude::*;
use web_sys::AudioContext;

mod audio;
use crate::audio::AUDIO_STR;

cfg_if! {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function to get better error messages if we ever panic.
    if #[cfg(feature = "console_error_panic_hook")] {
        extern crate console_error_panic_hook;
        use console_error_panic_hook::set_once as set_panic_hook;
    } else {
        #[inline]
        fn set_panic_hook() {}
    }
}

cfg_if! {
    // When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
    // allocator.
    if #[cfg(feature = "wee_alloc")] {
        extern crate wee_alloc;
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}

#[wasm_bindgen]
pub fn get_audio() -> Vec<f32> {
    set_panic_hook();

    serde_json::from_str(AUDIO_STR).expect("failed to deserialize audio data")
}

#[wasm_bindgen]
pub fn play_audio() {
    set_panic_hook();

    let audio = get_audio();
    let ctx = AudioContext::new().expect("failed to create webaudio context");

    let buffer = ctx
        .create_buffer(2 as u32, audio.len() as u32, 44_100 as f32)
        .expect("failed to create audio buffer");
    let mut left_channel = buffer
        .get_channel_data(0)
        .expect("failed to get left_channel");
    let mut right_channel = buffer
        .get_channel_data(1)
        .expect("failed to get right_channel");

    for (i, sample) in audio.iter().enumerate() {
        left_channel[i] = *sample;
        right_channel[i] = *sample;
    }

    let source = ctx
        .create_buffer_source()
        .expect("failed to spawn new webaudio buffer source node");
    source.set_buffer(Some(&buffer));
    source
        .connect_with_audio_node(&ctx.destination())
        .expect("failed to connect the source to the ctx destination");
    source.start().expect("failed to start webaudio source");
}
