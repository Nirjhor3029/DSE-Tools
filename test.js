function firstFunction(_callback) {
    // do some asynchronous work
    // and when the asynchronous stuff is complete
    // getData("industriesByCat.txt");
    const fs = require('fs');
    let jsonData;
    fs.readFile("industriesByCat.txt", 'utf8', function (err, data) {
        if (err) throw err;
        jsonData = JSON.parse(data);
        // console.log(jsonData);
        console.log(jsonData);
        _callback();
    });

}

function secondFunction() {
    // call first function and pass in a callback function which
    // first function runs when it has completed
    firstFunction(function () {
        console.log('huzzah, I\'m done!');
    });
}
secondFunction();
