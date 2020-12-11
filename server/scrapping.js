const express = require('express');
app = express();
const request = require('request');

const rp = require('request-promise');
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');

    next();
})
const bodyParser = require('body-parser');
const fs = require('fs');
const { isRegExp } = require('util');
const { UV_FS_O_FILEMAP } = require('constants');

app.get("/myterm/:word", (req, res) => {
    let myparams = escape(req.params.word);
    const url = 'http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel=' + myparams + '&rel=';
    // tout mes expression reguliere pour extraire l'info
    const myRegexp = /<def>[\w \W]+<\/def>/m;
    const myRegexpNod = /e;[0-9]+;'[\w > èîéôêâà -]+';[0-9]+;[0-9]+/mg;
    const noExisting = /Le terme '[\w\W]+' n'existe pas/gm;
    const br = /<br\W\/>/g;
    let filename = myparams + ".json";
    let wordsearch = req.params.word;
    console.log(myparams);

    fs.readFile(filename, (err, datafile) => {
        if (err) {
            try {
                rp({ url: url, encoding: 'latin1' })
                    .then(function(data) {
                        var obj = {
                            Dico: []
                        };

                        if (noExisting.test(data)) {
                            let nofound = "Le terme " + req.params.word + " n'existe pas";
                            res.end(JSON.stringify(nofound))
                        } else {
                            var mot = {
                                "word": "",
                                "definition": "",
                                "node": [],
                                "relation_sortant": [],
                                "Raffinement": [],
                                "Raffinement_Morpho": [],
                                "taille": 0,
                                "otherDef": ""
                            };

                            let matcheDef = data.match(myRegexp);
                            let matcheNode = data.match(myRegexpNod);
                            let map = new Map();

                            if (matcheNode != null) {
                                for (let i = 0; i < matcheNode.length; i++) {

                                    var objectNode = {
                                        "id": '',
                                        "name": ''
                                    };
                                    var noeuds = matcheNode[i].split(";");
                                    if (noeuds[3] != "200") {
                                        objectNode.id = noeuds[1];
                                        let taille = noeuds[2].length;
                                        objectNode.name = noeuds[2].substring(1, taille - 1);
                                        map.set(objectNode.id, objectNode.name);
                                    }
                                }
                            }
                            var fisrtNode;
                            let myRegexpRelSor;
                            if (matcheNode != null) {
                                fisrtNode = matcheNode[0].split(";");
                                myRegexpRelSor = new RegExp('r;[0-9]+;' + fisrtNode[1] + ';[0-9]+;[0-9]+;[0-9]+', 'mg');

                            }
                            //console.log(fisrtNode)
                            let myRegexpFormatedNodMorf = new RegExp('e;[0-9]+;\'[\\w > èîéôêâàï -]+\';[0-9]+;[0-9]+;\'' + wordsearch + '>[a-zA-Z èîéôêâàï-]+:[a-zA-Z :+èîéôêâàï-]*\'', 'mg');
                            let myRegexpFormatedNod = new RegExp('e;[0-9]+;\'[\\w > èîéôêâàï -]+\';[0-9]+;[0-9]+;\'' + wordsearch + '>[a-zA-Z èîéôêâàï-]+\'', 'mg');
                            //let myRegexpRelEnt=  new RegExp('r;[0-9]+;[0-9]+;'+fisrtNode[1]+';[0-9]+;[0-9]+','mg');
                            //let matcheRelationEntry = data.match(myRegexpRelEnt);
                            let matcheRelationExit = data.match(myRegexpRelSor);
                            let matchRaffinement = data.match(myRegexpFormatedNod);
                            let matcheNodeMorphologique = data.match(myRegexpFormatedNodMorf);

                            if (matcheNodeMorphologique != null) {
                                for (let i = 0; i < matcheNodeMorphologique.length; i++) {
                                    var myObject = {
                                        "id": '',
                                        "rfLink": ''
                                    };
                                    let part = matcheNodeMorphologique[i].split(';');
                                    myObject.id = part[1];
                                    let varsplit = part[5].split(">");
                                    let taille = varsplit[1].length;
                                    let cut = varsplit[1].substring(0, taille - 1).split(':');
                                    myObject.rfLink = cut[0];
                                    mot.Raffinement_Morpho.push(myObject);


                                }
                            }

                            console.log(matcheNodeMorphologique);
                            if (matchRaffinement != null) {
                                for (let i = 0; i < matchRaffinement.length; i++) {
                                    var rafObject = {
                                        "id": '',
                                        "rfLink": ''
                                    };
                                    var temp = matchRaffinement[i].split(";");
                                    rafObject.id = temp[1];
                                    let varsplit = temp[5].split(">");
                                    let taille = varsplit[1].length;
                                    rafObject.rfLink = varsplit[1].substring(0, taille - 1);
                                    mot.Raffinement.push(rafObject);
                                }
                            }
                            if (matcheRelationExit != null) {
                                for (let i = 0; i < matcheRelationExit.length; i++) {
                                    var objectRel = {
                                        "relation": "",
                                        "type": "",
                                        "poids": ""
                                    };
                                    var relation = matcheRelationExit[i].split(";");

                                    if (parseInt(relation[5]) > 0) {
                                        let findname = map.get(relation[3]);
                                        if (findname != null) {
                                            objectRel.relation = map.get(relation[3]);
                                            objectRel.type = relation[4];
                                            objectRel.poids = relation[5];
                                            mot.relation_sortant.push(objectRel)
                                        }

                                    }
                                }
                            }

                            mot.word = req.params.word;
                            if (matcheDef == null) {
                                mot.definition = "";
                            } else if (matcheDef[0].length < 25) {
                                mot.definition = "";
                            } else {
                                let definition = matcheDef[0].substring(5);
                                definition = definition.substring(0, definition.length - 6);
                                mot.definition = definition;
                            }
                            //mot.relation_entrant = matcheRelationEntry;
                            obj.Dico.push(mot);

                            initJsonFile(filename, obj)
                            res.end(JSON.stringify(mot))

                        }

                    }).catch(function(reason) {
                        console.log(reason)
                    });

            } catch (e) {
                res.end(JSON.stringify(nofound));
                console.log("Error");
            }

        } else {
            const testFolder = './';
            var obj = {
                Dico: []
            };
            obj = JSON.parse(datafile)
            let compteur = 0;
            let fileWithName = myparams + "%3E";
            let objFile = [];
            var allfiles = [];
            fs.readdirSync(testFolder).forEach(file => {
                if (file.includes(fileWithName)) {
                    compteur = compteur + 1;
                    allfiles.push(file)
                }
            });
            //console.log(typeof compteur)
            if (compteur <= obj.Dico[0].taille) {
                console.log("full of")
                res.end(JSON.stringify(obj.Dico[0]))

            } else {
                var mycontent = "tempFile" + Math.floor(100000 + Math.random() * 900000) + ".txt";
                obj.Dico[0].otherDef = "";
                for (let i = 0; i < allfiles.length; i++) {
                    fs.readFile(allfiles[i], (err, dataJfile) => {
                        if (err) {} else {
                            newObj = JSON.parse(dataJfile)
                            var Raffinement_define = newObj.Dico[0].definition + "//DEF//";
                            fs.writeFile(mycontent, Raffinement_define, { flag: 'a' }, (err) => {
                                if (err) {
                                    console.log(err);
                                }
                                if (i == allfiles.length - 1) {
                                    fs.readFile(mycontent, (err, mesDef) => {
                                        if (err) {
                                            console.log(err)
                                            res.end(JSON.stringify(obj.Dico[0]))
                                        }
                                        obj.Dico[0].otherDef = mesDef.toString();
                                        let temp = compteur - obj.Dico[0].taille;
                                        obj.Dico[0].taille = obj.Dico[0].taille + temp;
                                        var json = JSON.stringify(obj);
                                        fs.writeFile(filename, json, (err) => {
                                            if (err) {
                                                throw err;
                                            }
                                            console.log("JSON data is changed.");
                                        });
                                        res.end(JSON.stringify(obj.Dico[0]))

                                        deleteContent(mycontent)
                                    })

                                }
                            });

                        }
                    })

                }
            }

        }
    })



});

function deleteContent(mycontent) {
    fs.unlinkSync(mycontent);
}


function initJsonFile(filename, obj) {

    var json = JSON.stringify(obj);

    fs.writeFile(filename, json, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");

    });
}






app.listen(8888, () => {
    console.log("Server is Listening on port 8888")


})