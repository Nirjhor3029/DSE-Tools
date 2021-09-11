const express = require("express");

const app = express();

app.listen(5000, () => {
    console.log(`Server is up and running on 5000 ...`);
});

app.get("/", (req, res) => {

    let data = {
        name: "GFG",
        age: 18,
        male: true
    }

    res.send(data);
});
