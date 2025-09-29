const text = "Aryan Pathrabe";
let index = 0;

function typeWriter() {
    if (index < text.length) {
        document.getElementById("typewriter").innerHTML += text.charAt(index);
        index++;
        setTimeout(typeWriter, 150);
    }
}

window.onload = typeWriter;