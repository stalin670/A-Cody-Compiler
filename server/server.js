const express = require("express");
const Axios = require('axios');
const PORT = process.env.PORT || 8000;
const app = express();

// api end point
app.post('/compile', (req, res) => {

    // Accessing data from client
    let code = req.body.code;
    let language = req.body.language;
    let input = req.body.input;

    // Language Map
    let languageMap = {
        "c": { language: "c", version: "10.2.0" },
        "cpp": { language: "c++", version: "10.2.0" },
        "python": { language: "python", version: "3.10.0" },
        "java": { language: "java", version: "15.0.2" }
    };

    if(!languageMap[language]) {
        return res.status(400).send({error : "Language Unsupported"});
    }

    // Data
    let data = {
        "language" : languageMap[language].language,
        "version" : languageMap[language].version,
        "files" : [
            {
                "name" : "main",
                "content" : code
            }
        ],
        "stdin" : code
    };

    let config = {
        method : 'post',
        url: 'https://emkc.org/api/v2/piston/execute',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    // call the api
    Axios(config).then((response) => {
        console.log(response.data);
        return res.status(201).json(response.data.run);
    }).catch((error) => {
        console.log(error);
        return res.status(500).send({error : "Something went wrong"});
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
