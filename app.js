const btn = document.querySelector('.talk');
const content = document.querySelector('.content');


function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.volume = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}


function wishMe() {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) {
        speak("Good Morning, Boss!");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon, Master!");
    } else {
        speak("Good Evening, Sir!");
    }
}


window.addEventListener('load', () => {
    speak("Initializing JARVIS...");
    wishMe();
});


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false; 
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        content.textContent = "Listening...";
        console.log("Speech recognition started.");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        content.textContent = `You said: ${transcript}`;
        takeCommand(transcript);


        recognition.stop();
    };

    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        content.textContent = `Error: ${event.error}`;
        speak(`Error encountered: ${event.error}`);


        recognition.stop();
    };

    btn.addEventListener('click', () => {
        try {
            recognition.start(); 
        } catch (error) {
            console.error("Error starting speech recognition:", error);
        }
    });
} else {
    content.textContent = "Sorry, your browser does not support Speech Recognition.";
    console.error("SpeechRecognition API not supported.");
}




function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, how may I help you?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        const query = message.replace(/ /g, "+");
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
        speak("Here is what I found on the internet regarding " + message);
    } else if (message.includes('wikipedia')) {
        const query = message.replace("wikipedia", "").trim();
        window.open(`https://en.wikipedia.org/wiki/${query}`, "_blank");
        speak("Here is what I found on Wikipedia regarding " + query);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        speak("The current time is " + time);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });
        speak("Today's date is " + date);
    } 

    else if (message.includes('weather')) {
        getWeather();
    } else if (message.includes('joke')) {
        tellJoke();
    } else if (message.includes('play music')) {
        speak("Opening Spotify...");
        window.open("https://open.spotify.com", "_blank");
    } else if (message.includes('add task')) {
        const task = message.replace("add task", "").trim();
        addTask(task);
    } else if (message.includes('list tasks')) {
        listTasks();
    } 
     else {
        const query = message.replace(/ /g, "+");
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
        speak("I found some information on Google for " + message);
    }
}

function getWeather() {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=')
        .then(response => response.json())
        .then(data => {
            const weather = `The weather in ${data.name} is ${data.weather[0].description} with a temperature of ${data.main.temp}°C.`;
            speak(weather);
        })
        .catch(error => {
            console.error("Weather API Error:", error);
            speak("I couldn't fetch the weather at the moment.");
        });
}


function tellJoke() {
    fetch('https://official-joke-api.appspot.com/random_joke')
        .then(response => response.json())
        .then(data => {
            const joke = `${data.setup} ... ${data.punchline}`;
            speak(joke);
        })
        .catch(error => {
            console.error("Joke API Error:", error);
            speak("I couldn't fetch a joke at the moment.");
        });
}


let tasks = [];

function addTask(task) {
    if (task) {
        tasks.push(task);
        speak(`Task added: ${task}`);
    } else {
        speak("Please specify the task.");
    }
}

function listTasks() {
    if (tasks.length > 0) {
        speak("Here are your tasks: " + tasks.join(", "));
    } else {
        speak("You have no tasks.");
    }
}


