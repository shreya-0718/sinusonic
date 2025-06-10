const input = document.getElementById('input');

// set up variables for drawing
var amplitude = 40;
var interval = null;
var reset = false;

// create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

// create Oscillator node
const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";
var funct = "sine"; // default function type

//define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"); 
var width = ctx.canvas.width;
var height = ctx.canvas.height;

// initializing spacing variables
var timepernote = 0;
var length = 0;

oscillator.start();
gainNode.gain.value = 0;

// set up note frequencies
notenames = new Map();
notenames.set("C", 261.63);
notenames.set("D", 293.66); 
notenames.set("E", 329.63);
notenames.set("F", 349.23);
notenames.set("G", 392.00);
notenames.set("A", 440.00);
notenames.set("B", 493.88);
notenames.set(" ", 0);

// start song button
const startSong = document.getElementById("submit");

// color variables
const colorpicker1 = document.getElementById("color1");
const colorpicker2 = document.getElementById("color2");

// volume control variables
const vol_slider = document.getElementById("vol-slider");

// recording variables
const recording_toggle = document.getElementById('record');

// waveform selection buttons
const sineB = document.getElementById("sine");
const squareB = document.getElementById("square");
const sawtoothB = document.getElementById("sawtooth");
const triangleB = document.getElementById("triangle");

function frequency(pitch) {
    freq = pitch / 10000;
    
    startSong.innerHTML = "Submitted! Now enjoy 🎵";
    gainNode.gain.setValueAtTime(vol_slider.value, audioCtx.currentTime);
    setting = setInterval(() => {gainNode.gain.value = vol_slider.value}, 1);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);

    setTimeout(() => { 
        clearInterval(setting); 
        gainNode.gain.value = 0; 
    }, ((timepernote) - 30));
}

function handle() {
    reset = true;
    audioCtx.resume();
    gainNode.gain.value = 0;

    var usernote = input.value.toUpperCase();
    var noteslist = [];

    length = usernote.length;
    timepernote = (6000 / length); // in milliseconds

    for (i = 0; i < input.value.length; i++) {
        if (!notenames.has(usernote[i])) {
            alert("Please enter a valid note! (C, D, E, F, G, A, B): " + usernote[i]);
            return;
        }

        noteslist.push(notenames.get(usernote.charAt(i)));
    }

    let j = 0;
    repeat = setInterval(() => {
        if (j < noteslist.length) {
            frequency(noteslist[j]);
            drawWave();
            j++;
        } else {
            startSong.innerHTML = "Submit your song 💃";
            clearInterval(repeat);
        }
    }, timepernote)

    //frequency(notenames.get(usernote));
    //drawWave();
}

var counter = 0;

function drawWave(){
    clearInterval(interval);

    if (reset) {
        ctx.clearRect(0, 0, width, height);
        x = 0;
        y = height/2;
        ctx.moveTo(x, y);
        ctx.beginPath();
    }

    counter = 0;
    interval = setInterval(line, 20);
    reset = false;
}

function line() {
    amplitude = vol_slider.value*.6; // adjust amplitude based on volume slider
    if (funct === "sine") {
        y = height/2 + (amplitude * Math.sin(x * 2 * Math.PI * freq * (0.5 * length)));
    } else if (funct === "square") {
        y = height/2 + (amplitude * Math.sign(Math.sin(x * 2 * Math.PI * freq * (0.5 * length))));
    } else if (funct === "sawtooth") {
        y = height/2 + (amplitude * (2 * (x * freq * (0.5 * length) - Math.floor(0.5 + x * freq * (0.5 * length)))));
    } else if (funct === "triangle") {
        y = height/2 + (amplitude * (Math.asin(Math.sin(x * 2 * Math.PI * freq * (0.5 * length))) / Math.PI));
    }

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, colorpicker1.value);
    gradient.addColorStop(1, colorpicker2.value);

    ctx.strokeStyle = gradient;
    ctx.lineStyle = "solid";

    ctx.lineTo(x, y);
    
    ctx.stroke();
    x += 1;
    counter++;

    if (counter > timepernote / 20) {
        clearInterval(interval);
    }
}

// shape editing functions
function sine() {
    oscillator.type = "sine";
    funct = "sine";

    // button text update
    sineB.innerHTML = "Sine Wave 🎵";
    squareB.innerHTML = "Square Wave 🟩";
    sawtoothB.innerHTML = "Sawtooth Wave 🪚";
    triangleB.innerHTML = "Triangle Wave 📐";
}

function square() {
    oscillator.type = "square";
    funct = "square";
    
    // button text update
    sineB.innerHTML = "Sine Wave 🌊";
    squareB.innerHTML = "Square Wave 🎵";
    sawtoothB.innerHTML = "Sawtooth Wave 🪚";
    triangleB.innerHTML = "Triangle Wave 📐";
}

function sawtooth() {
    oscillator.type = "sawtooth";
    funct = "sawtooth";

    // button text update
    sineB.innerHTML = "Sine Wave 🌊";
    squareB.innerHTML = "Square Wave 🟩";
    sawtoothB.innerHTML = "Sawtooth Wave 🎵";
    triangleB.innerHTML = "Triangle Wave 📐";
}

function triangle() {
    oscillator.type = "triangle";
    funct = "triangle";

    // button text update
    sineB.innerHTML = "Sine Wave 🌊";
    squareB.innerHTML = "Square Wave 🟩";
    sawtoothB.innerHTML = "Sawtooth Wave 🪚";
    triangleB.innerHTML = "Triangle Wave 🎵";
}

// set up audio recording
var blob, recorder = null;
var chunks = [];

function startRecording(){
    const canvasStream = canvas.captureStream(20); // Frame rate of canvas
    const audioDestination = audioCtx.createMediaStreamDestination();
    gainNode.connect(audioDestination);

    const combinedStream = new MediaStream();
    // Add in video data

    canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
    audioDestination.stream.getAudioTracks().forEach(track => combinedStream.addTrack(track))

    recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });

    recorder.ondataavailable = e => {
        if (e.data.size > 0) {
            chunks.push(e.data);
        }
    };

    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recording.webm';
        a.click();
        URL.revokeObjectURL(url);
    };

    recorder.start();
}

var is_recording = false;
function toggle(){
    is_recording = !is_recording;
    if (is_recording) {
        recording_toggle.innerHTML = " Stop Recording 🛑 ";
        startRecording();
    } else {
        recording_toggle.innerHTML = " Start Recording 🎙️ ";
        recorder.stop();
    }
}

function myFunction() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}