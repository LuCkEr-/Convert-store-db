var mysql = require('mysql');
var SteamID = require('steamid');
var config = require('./config.js');

var Zconnection =  mysql.createConnection({
    host: config.zeph.host,
    user: config.zeph.user,
    password: config.zeph.password,
    database: config.zeph.database
});

Zconnection.connect(function(err) {
    if (err) {
        console.error('Error: ' + err);
        return;
    }
});

var Rconnection = mysql.createConnection({
    host: config.red.host,
    user: config.red.user,
    password: config.red.password,
    database: config.red.database
});

Rconnection.connect(function(err) {
    if (err) {
        console.error('Error: ' + err);
        return;
    }
});

Rconnection.query('SELECT auth,name,credits FROM store_users', function(err, results, fields) {
    if (err) {
        console.error('Error: ' + err);
        return;
    }
    //console.log(ConvertSteamID(results[0].auth));
    results.forEach(function(value, index) {
        var UName = value.name;
        
        UName = UName.replace(/"/g, '\\"');
        UName = UName.replace(/'/g, '\\"');
        //UName = UName.replace("'", "");
        //UName = UName.replace('"', "");
        
        if (value.credits > 0) {
            Zconnection.query('INSERT INTO store_players(authid, name, credits, date_of_join, date_of_last_join) VALUES ("' + ConvertSteamID(value.auth) + '","' + value.name + '",' + value.credits + ',' + 1473015042 + ',' + 1473015042 + ')', function(err, result) {
                if (err) {
                    console.error('Error: ' +  err);
                    return;
                }
                console.log('Added ' + index + ' / ' + results.lenght + ' | Name: ' + value.name);
            });
        }
    });
});

function ConvertSteamID(auth) {
    var steamID = "[U:1:" + auth + "]";
    var sID = new SteamID(steamID);
    return sID.getSteam2RenderedID().substring(8);
}
