import { Server, Socket } from "socket.io";

const io = new Server({
    cors:{
        origin: "http://localhost:5173/"
    }
})

io.listen(8001);

const characters = [];

const generateRandomPosition = () =>{
    return [Math.random() * 3, 0, Math.random() * 3];
};

const generateRandomHexColor = () =>{
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

io.on("connection", (socket) => {
    console.log("user connected");

    characters.push({
        id: socket.id,
        position: generateRandomPosition(),
        hairColor: generateRandomHexColor(),
        topColor: generateRandomHexColor(),
        bottomColor: generateRandomHexColor(),
        hairColorZ: generateRandomHexColor(),
        bodyColorZ: generateRandomHexColor(),
        handColorZ: generateRandomHexColor(),
    });

    socket.emit("hello");

    io.emit("characters", characters);

    socket.on("move", (position) => {
        const character = characters.find((character) => character.id === socket.id);
        character.position = position;
        io.emit("characters", characters);
    });


    socket.on("disconnect", (socket) => {
        console.log("user disconnected");

        characters.splice(
            characters.findIndex((characters) => characters.id === socket.id),
            1
        );
        io.emit("characters", characters);
    });
});

