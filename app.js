// UI comp
const startBtn = document.createElement("button");
startBtn.innerHTML = "Start listening";
document.getElementsByTagName("button").bgcolor="#FFFF00";
//document.getElementsByTagName("button").bgcolor="#FFFF00";
const result = document.createElement("div");
const processing = document.createElement("p");
document.write("<body><h1>Voice Assistant</h1><p>Give it a try with 'hello', 'how are you', 'what's your name', 'what time is it', 'stop', ... </p></body>");
document.body.append(startBtn);
document.body.append(result);
document.body.append(processing);

// speech to text
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let toggleBtn = null;
if (typeof SpeechRecognition === "undefined") {
    startBtn.remove();
    result.innerHTML = "<b>Browser does not support Speech API. Please download latest chrome.<b>";
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = event => {
        const last = event.results.length - 1;
        const res = event.results[last];
        const text = res[0].transcript;
        if (res.isFinal) {
            processing.innerHTML = "processing ....";
            
            const response = process(text);
            const p = document.createElement("p");
            p.innerHTML = `You said: ${text} </br>Alexa said: ${response}`;
            processing.innerHTML = "";
            result.appendChild(p);

            // read it out
            speechSynthesis.speak(new SpeechSynthesisUtterance(response));
        } else {
            processing.innerHTML = `listening: ${text}`;
        }
    }
    let listening = false;
    toggleBtn = () => {
        if (listening) {
            recognition.stop();
            startBtn.textContent = "Start listening";
        } else {
            recognition.start();
            startBtn.textContent = "Stop listening";
        }
        listening = !listening;
    };
    startBtn.addEventListener("click", toggleBtn);

}

// processor
function process(rawText) {
    let text = rawText.replace(/\s/g, "");
    //let text = rawText
    text = text.toLowerCase();
    let response = null;
    
    if(text.includes("hello")){
        response = "hi, how are you doing?";
    }
    else if(text.includes("name")){
        response = "My name's Alexa.";
    }
    else if(text.includes("howareyou")){
        response = "I'm good.";
    }
    else if(text.includes("time")){
        response = new Date().toLocaleTimeString();
    }
    else if(text.includes("stop") || text.includes("exit")){
        response = "Bye!!";
        toggleBtn();
    }

    if (!response) {
        window.open(`http://google.com/search?q=${rawText.replace("search", "")}`, "_blank");
        return `I found some information for ${rawText}`;
    }

   if(!text || text.length === 0 ){
        response = "No voice commmand detected";
    }

    return response;
}
