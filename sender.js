import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const port = 3000;

const local_token = "123456";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

function respond(sender, text) {
    console.log(sender, text);
    const access_token = "___API-KEY___";
    const url = `https://graph.facebook.com/v9.0/me/messages?access_token=${access_token}`;
    const message = {
        "recipient": sender,
        "message": {
            "text": `Replying to your text\n ${text}\nHii!! How do you do?`
        }
    };

    axios.post(url, message).then(() => {
        console.log("Responded");
    });
}

app.get('/', (req, res) => {
    console.log(req.query);
    const challenge = req.query['hub.challenge'];
    const verify_token = req.query['hub.verify_token'];
    if (local_token === verify_token) {
        res.send(challenge);
    } else {
        res.send("Hello World");
    }
});

app.post('/', (req, res) => {
    const body = req.body;
    body.entry.forEach(entry => {
        if (entry["messaging"]) {
            entry.messaging.forEach(messaging => {
                respond(messaging.sender, messaging.message.text);
            });
        }
    });
    res.send("OK You are cool!!");
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
