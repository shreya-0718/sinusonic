const input = document.getElementById('input');

// set up variables for drawing
var amplitude = 40;
var interval = null;
var reset = false;

// create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

// color variables
const colorpicker = document.getElementById("color");

// create Oscillator node
const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

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

function frequency(pitch) {
    freq = pitch / 10000;
    gainNode.gain.setValueAtTime(100, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + (timepernote / 1000) - 0.1);

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
            alert("Please enter a valid note (C, D, E, F, G, A, B)");
            return;
        }

        noteslist.push(notenames.get(usernote.charAt(i)));
    }

    let j = 0;
    repeat = setInterval(() => {
        if (j < noteslist.length) {
           frequency(noteslist[j]);
           drawWave();
        j++
        } else {
            clearInterval(repeat)
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
    y = height/2 + (amplitude * Math.sin(x * 2 * Math.PI * freq * (0.5 * length)));
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = colorpicker.value;
    
    ctx.stroke();
    x += 1;
    counter++;

    if (counter > timepernote / 20) {
        clearInterval(interval);
    }
}

