const {google} = require("googleapis");
var getPASS = 0;
var loopFind = 0;
var PLACE = 0;
var FB = 0;
let create_account_accept = "0";
let canilogin = "0";
function delay(param1) {
    return new Promise(resolve => setTimeout(resolve, param1));
}
async function replace_id(ID, WHERE){
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });    
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});
    const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "Main Info!C"+WHERE,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[ID]],
        },
    });
    MI = ID;
    await find_file(ID);
}
async function save_file(AID, FILE){
    await delay(1000);
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });    
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});
    const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Main Info!C:C",
    });

    const allUsers = getRows.data.values;
    PLACE = 0;
    for ( i=0; i<allUsers.length; i++ ){
        if (allUsers[i][0] == AID){
            PLACE = i+1;
            i = allUsers.length;
        }
    }
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "Main Info!D"+PLACE,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[FILE]],
        },
    });
}
async function find_file(AID){
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });    
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});
    const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Main Info!C:C",
    });
    
    const allUsers = getRows.data.values;
    PLACE = 0;
    for ( i=0; i<allUsers.length; i++ ){
        if (allUsers[i][0] == await AID){
            PLACE = i;
            i = allUsers.length;
        }
    }
    const getRows2 = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Main Info!D:D",
    });
    const al = await getRows2.data.values;
    if (PLACE > 0){
        FB = al[PLACE][0];
    }else{
        FB = "ERROR";
    }
}
async function create_account(n, p, id){
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
        
    const client = await auth.getClient();

    const googleSheets = google.sheets({version: "v4", auth: client});
    const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Main Info!A:A",
    });
    
    const allUsers = getRows.data.values;
    loopFind = 0;
    var SEC = 0;
    for ( i=0; i<allUsers.length; i++ ){
        if (allUsers[i][0] !== undefined){
            if (allUsers[i][0].toUpperCase() == n.toUpperCase()){
                loopFind = 1;
                i = allUsers.length;
            }
        }else{
            SEC = i;
        }
    }
    if (loopFind !== 1){
        if (SEC == 0){
            await googleSheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range: "Main Info!A:D",
                valueInputOption: "USER_ENTERED",
                resource:{
                    values: [[n, p, id, "NO FILE FOUND"]],
                },
            });
        }else{
            await googleSheets.spreadsheets.values.update({
                auth,
                spreadsheetId,
                range: "Main Info!A"+String(SEC+1)+":D"+String(SEC+1),
                valueInputOption: "USER_ENTERED",
                resource:{
                    values: [[n, p, id, "NO FILE FOUND"]],
                },
            });
        }
        return "YES";
    }else{
        return "NO";
    }
}
async function sign_in(name,pass,mid){
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });    
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});
    const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Main Info!A:A",
    }); 
    const allUsers = await getRows.data.values;

    for (let i = 0; i<allUsers.length; i++ ){
        if (allUsers[i][0] !== undefined){
            if (allUsers[i][0] == name){
                loopFind = 1;
                getPASS = i; 
                break;
            }
        }
    }
    const findPass = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Main Info!B:B",
    });
    const allPass = await findPass.data.values;
    if (loopFind == 1 && allPass[getPASS][0] == pass){
        await replace_id(mid, getPASS+1);
        return "YES";
    }else{
        return "NO";
    }
}
async function find_all_clans(){
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });    
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});
    const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "CLANS!A:A",
    }); 
    const Clans = await getRows.data.values;
    return Clans;
}
async function find_all_clanuser(clan){
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });    
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});
    const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
    const gr = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "CLANS!A:A",
    }); 
    const allClans = await gr.data.values;
    var where = 0;
    var look_clan = 0;
    for ( i=1; i<allClans.length; i++ ){
        look_clan = allClans[i][0];
        if (look_clan !== undefined){
            look_clan = look_clan.toUpperCase();
            look_clan = (look_clan.charAt(66)+look_clan.charAt(67)+look_clan.charAt(68)+look_clan.charAt(69)+look_clan.charAt(70)+look_clan.charAt(71));
            look_clan = look_clan.replace(/[^a-zA-Z0-9 ]/g, '');
            look_clan = look_clan.replace(" ", '');
            if (look_clan == clan.toUpperCase()){
                where = String(i+1);
                i = allClans.length;
            }
        }
    }
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "CLANS!B"+where+":Z"+where,
    });
    const users = await getRows.data.values;
    return users;
}
async function add_to_clan(clan, user){
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });    
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});
    const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "CLANS!A:A",
    }); 
    const allClans = await getRows.data.values;
    var where_clan = "";
    var look_clan = 0;
    for ( i=1; i<allClans.length; i++ ){
        look_clan = allClans[i][0];
        if (look_clan !== undefined){
            look_clan = look_clan.toUpperCase();
            look_clan = (look_clan.charAt(66)+look_clan.charAt(67)+look_clan.charAt(68)+look_clan.charAt(69)+look_clan.charAt(70)+look_clan.charAt(71));
            look_clan = look_clan.replace(/[^a-zA-Z0-9 ]/g, '');
            look_clan = look_clan.replace(" ", '');
            if (look_clan.toUpperCase() == clan.toUpperCase()){
                where_clan = String(i+1);
                i = allClans.length;
            }
        }
    }
    var RANGE = "CLANS!A"+where_clan+":Z"+where_clan;
    const getCol = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: RANGE,
    });
    const ClanUser = await getCol.data.values;
    var index = String.fromCharCode(97 + ClanUser[0].length)
    index = index.toUpperCase();
    var RANGE = "CLANS!"+index+where_clan+":"+index+where_clan;
    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: RANGE,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[user]],
        },
    });
    var newString = ClanUser[0][0];
    var what = String(ClanUser.length)
    if (parseInt(what) < 10){
        what = "0"+what;
    }
    newString = newString.replaceAt(73,what.charAt(0));
    newString = newString.replaceAt(74,what.charAt(1));
    RANGE = "CLANS!A"+where_clan+":A"+where_clan;
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: RANGE,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[newString]],
        },
    });
}
async function remove_to_clan(clan, user){
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });    
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});
    const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "CLANS!A:A",
    }); 
    const allClans = await getRows.data.values;
    var where_clan = "";
    var look_clan = 0;
    for ( i=1; i<allClans.length; i++ ){
        look_clan = allClans[i][0];
        if (look_clan !== undefined){
            look_clan = look_clan.toUpperCase();
            look_clan = (look_clan.charAt(66)+look_clan.charAt(67)+look_clan.charAt(68)+look_clan.charAt(69)+look_clan.charAt(70)+look_clan.charAt(71));
            look_clan = look_clan.replace(/[^a-zA-Z0-9 ]/g, '');
            look_clan = look_clan.replace(" ", '');
            if (look_clan == clan.toUpperCase()){
                where_clan = String(i+1);
                i = allClans.length;
            }
        }
    }
    var RANGE = "CLANS!A"+where_clan+":Z"+where_clan;
    const getCol = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: RANGE,
    });
    var array = [[]];
    const ClanUser = await getCol.data.values;
    for ( i=0; i<ClanUser[0].length; i++ ){
        look_name = ClanUser[0][i];
        if (look_name !== user){
            array[0].push(look_name);
        }
    }
    for ( i=0; i<(26-array[0].length); i++ ){
        array[0].push("");
    }
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: RANGE,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: array,
        },
    });
    var newString = ClanUser[0][0];
    var what = String(ClanUser[0].length-1)
    if (parseInt(what) < 10){
        what = "0"+what;
    }
    newString = newString.replaceAt(73,what.charAt(0));
    newString = newString.replaceAt(74,what.charAt(1));
    RANGE = "CLANS!A"+where_clan+":A"+where_clan;
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: RANGE,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[newString]],
        },
    });
    
    if (what == "00"){
        delete_clan(clan);
    }
}
async function AIIC_CLAN(user){
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });    
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});
    const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "CLANS!A:Z",
    }); 
    const allClanData = await getRows.data.values;
    var look_clan = 0;
    for ( i=0; i<allClanData.length; i++ ){
        for ( j=1; j<26; j++ ){
            if(allClanData[i][j] === user){
                look_clan = allClanData[i][0];
                i = allClanData.length;
                j = 26;
            }
        }
    }
    if (look_clan !== 0){
        look_clan = (look_clan.charAt(66)+look_clan.charAt(67)+look_clan.charAt(68)+look_clan.charAt(69)+look_clan.charAt(70)+look_clan.charAt(71));
        look_clan = look_clan.replace(" ", "");
    }
    return look_clan;
}
async function FCC_CLAN(clan){
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });    
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});
    const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "CLANS!A:A",
    }); 
    const allClans = await getRows.data.values;
    var where_clan = 0;
    var look_clan = 0;
    for ( i=1; i<allClans.length; i++ ){
        look_clan = allClans[i][0];
        if (look_clan !== undefined){
            look_clan = look_clan.toUpperCase();
            look_clan = (look_clan.charAt(66)+look_clan.charAt(67)+look_clan.charAt(68)+look_clan.charAt(69)+look_clan.charAt(70)+look_clan.charAt(71));
            look_clan = look_clan.replace(/[^a-zA-Z0-9 ]/g, '');
            look_clan = look_clan.replace(" ", '');
            if (look_clan == clan.toUpperCase()){
                where_clan = i;
                i = allClans.length;
            }
        }
    }
    return allClans[where_clan][0];
}
async function update_clan_stats(stat, clan){
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });    
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});
    const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "CLANS!A:A",
    }); 
    const allClans = await getRows.data.values;
    var where_clan = "";
    var look_clan = 0;
    for ( i=1; i<allClans.length; i++ ){
        look_clan = allClans[i][0];
        if (look_clan !== undefined){
            look_clan = look_clan.toUpperCase();
            look_clan = (look_clan.charAt(66)+look_clan.charAt(67)+look_clan.charAt(68)+look_clan.charAt(69)+look_clan.charAt(70)+look_clan.charAt(71));
            look_clan = look_clan.replace(/[^a-zA-Z0-9 ]/g, '');
            look_clan = look_clan.replace(" ", '');
            if (look_clan == clan.toUpperCase()){
                where_clan = String(i+1);
                i = allClans.length;
            }
        }
    }
    var RANGE = "CLANS!A"+where_clan+":A"+where_clan;
    const getCol = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: RANGE,
    });
    const ClanUser = await getCol.data.values;
    j = 74;
    what = "";
    do{
        j++;
        what = what+(ClanUser[0][0].charAt(j));
    }while(!(what.includes("L")));
    newString = ClanUser[0][0];
    newString = newString.replace(what,stat);
    RANGE = "CLANS!A"+where_clan+":A"+where_clan;
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: RANGE,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[newString]],
        },
    });
}
async function RAM(user){
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });    
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});
    const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Main Info!A:A",
    }); 
    const allName = await getRows.data.values;
    var wn = 0;
    for ( i=1; i<allName.length; i++ ){
        if (allName[i][0] !== undefined){
            if (allName[i][0] == user){
                wn = String(i+1);
                i = allName.length;
            }
        }
    }
    const getMes = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Main Info!E"+wn+":E"+wn,
    });
    const MES = await getMes.data.values;
    return MES;
}
async function delete_clan(clan){
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });    
    const client = await auth.getClient();
    const googleSheets = google.sheets({version: "v4", auth: client});
    const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "CLANS!A:A",
    }); 
    const allClans = await getRows.data.values;
    var wn = 0;
    var look_clan = 0;
    for ( i=1; i<allClans.length; i++ ){
        look_clan = allClans[i][0];
        if (look_clan !== undefined){
            look_clan = look_clan.toUpperCase();
            look_clan = (look_clan.charAt(66)+look_clan.charAt(67)+look_clan.charAt(68)+look_clan.charAt(69)+look_clan.charAt(70)+look_clan.charAt(71));
            look_clan = look_clan.replace(/[^a-zA-Z0-9 ]/g, '');
            look_clan = look_clan.replace(" ", '');
            if (look_clan == clan.toUpperCase()){
                wn = String(i+1);
                i = allClans.length;
            }
        }
    }
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!A"+wn+":A"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!B"+wn+":B"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!C"+wn+":C"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!D"+wn+":D"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!E"+wn+":E"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!F"+wn+":F"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!G"+wn+":G"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!H"+wn+":H"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!I"+wn+":I"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!J"+wn+":J"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!K"+wn+":K"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!L"+wn+":L"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!M"+wn+":M"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!N"+wn+":N"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!O"+wn+":O"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!P"+wn+":P"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!Q"+wn+":Q"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!R"+wn+":R"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!S"+wn+":S"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!T"+wn+":T"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!U"+wn+":U"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!V"+wn+":V"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!W"+wn+":W"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!X"+wn+":X"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!Y"+wn+":Y"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: "CLANS!Z"+wn+":Z"+wn,
        valueInputOption: "USER_ENTERED",
        resource:{
            values: [[""]],
        },
    });
    
}
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 14537});
const clients = new Map();
console.log("Running on PORT "+ String(process.env.PORT || 14537));
wss.on('connection', (ws) => {
    const id = uuidv4();
    const metadata = { id };
    clients.set(ws, metadata);
    console.log("> "+String(id)+" connected!");
    ws.on('message', (BUF) => {
        var BF = BUF.toString('utf-8');
        if (BF.includes("LOGINDELUX_=-+")){
            var var1 = BF.indexOf("{");
            var var2 = BF.indexOf("}");
            var NB1 = BF.slice(var1+1, var2);
            var1 = BF.indexOf("}");
            var NB2 = BF.slice(var1+1, BF.length);
            NB1 = NB1.replace(/[^a-zA-Z0-9 ]/g, '');
            NB2 = NB2.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
            (async() => {
                canilogin = await sign_in(NB1, NB2, id);
                if (canilogin == "YES"){
                    ws.send("01YES");
                    ws.send("02"+FB);
                    ws.send("04"+NB1);
                    var clan = await AIIC_CLAN(NB1);
                    if (clan !== 0){
                        ws.send("06"+String(clan))
                        var code = await FCC_CLAN(clan);
                        code2 = code.slice(0, 50);
                        code3 = code.slice(50,100);
                        code4 = code.slice(100,150);
                        code5 = code.slice(150, code.length);
                        ws.send("07"+code2);
                        await delay(100);
                        ws.send("07"+code3);
                        await delay(100);
                        ws.send("07"+code4);
                        await delay(100);
                        ws.send("07"+code5);
                    }
                    var MESSAGE = await RAM(NB1);
                    ws.send("09"+String(MESSAGE));
                    await delay(100);
                    ws.send("03");
                }else{
                    ws.send("01NO");
                }
                canilogin = 0;
            })()
        }else{
            if (BF.includes("ACCOUNT'CREATEXUD|!32")){
                var var3 = BF.indexOf("{");
                var var4 = BF.indexOf("}");
                var CB1 = BF.slice(var3+1, var4);
                var3 = BF.indexOf("}");
                var CB2 = BF.slice(var3+1, BF.length);
                CB1 = CB1.replace(/[^a-zA-Z0-9 ]/g, '');
                CB2 = CB2.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
                (async() => {
                    create_account_accept = await create_account(CB1, CB2, id);
                    if (create_account_accept == "YES"){
                        ws.send("01YES");
                        ws.send("02NO FILE FOUND");
                        ws.send("04"+CB1);
                        await delay(200);
                        ws.send("03");
                    }else{
                        ws.send("01NO");
                    }
                    create_account_accept = 0;
                })()
            }else{
                if (BF.includes("FIND ALL CLANS")){
                    (async() => {
                        var clan_file = await find_all_clans();
                        ws.send("05"+clan_file);
                    })()
                }else{
                    if (BF.includes("CREATECLAN12212")){
                        var ccv1 = BF.indexOf("{");
                        var ccv2 = BF.indexOf("}");
                        var cc1 = BF.slice(0, ccv1);
                        cc1 = BF.slice(ccv1+1, ccv2);
                        cc1 = cc1.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
                        (async() => {
                            const auth = new google.auth.GoogleAuth({
                                keyFile: "credentials.json",
                                scopes: "https://www.googleapis.com/auth/spreadsheets",
                            });
                                
                            const client = await auth.getClient();
                        
                            const googleSheets = google.sheets({version: "v4", auth: client});
                            const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
                            const getRows = await googleSheets.spreadsheets.values.get({
                                auth,
                                spreadsheetId,
                                range: "CLANS!A:A",
                            }); 
                            const allClans = await getRows.data.values;
                            var wn = 0;
                            var look_clan = 0;
                            for ( i=1; i<allClans.length; i++ ){
                                look_clan = allClans[i][0];
                                if (look_clan == undefined){
                                    wn = String(i+1);
                                    i = allClans.length;
                                }
                            }
                            if (wn == 0){
                                await googleSheets.spreadsheets.values.append({
                                    auth,
                                    spreadsheetId,
                                    range: "CLANS!A:A",
                                    valueInputOption: "USER_ENTERED",
                                    resource:{
                                        values: [[cc1]],
                                    },
                                });
                            }else{
                                await googleSheets.spreadsheets.values.update({
                                    auth,
                                    spreadsheetId,
                                    range: "CLANS!A"+wn+":A"+wn,
                                    valueInputOption: "USER_ENTERED",
                                    resource:{
                                        values: [[cc1]],
                                    },
                                });
                            }
                            var clan_file = await find_all_clans();
                            ws.send("05"+clan_file);
                        })()
                    }else{
                        if (BF.includes("ADD_TO_CLAN1434")){
                            var acv1 = BF.indexOf("{");
                            var acv2 = BF.indexOf("}");
                            var ac1 = BF.slice(0, acv1);
                            ac1 = BF.slice(acv1+1, acv2);
                            ac1 = ac1.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
                            var ac2 = ac1.charAt(0)+ac1.charAt(1)+ac1.charAt(2)+ac1.charAt(3)+ac1.charAt(4)+ac1.charAt(5);
                            ac1 = ac1.slice(6,ac1.length);
                            ac2 = ac2.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
                            ac2 = ac2.replace(" ", "");
                            (async() => {
                                await add_to_clan(ac2,ac1);
                                var clan = await AIIC_CLAN(ac1);
                                if (clan !== 0){
                                    ws.send("06"+String(clan));
                                    var code = await FCC_CLAN(clan);
                                    code2 = code.slice(0, 50);
                                    code3 = code.slice(50,100);
                                    code4 = code.slice(100,150);
                                    code5 = code.slice(150, code.length);
                                    ws.send("07"+code2);
                                    await delay(100);
                                    ws.send("07"+code3);
                                    await delay(100);
                                    ws.send("07"+code4);
                                    await delay(100);
                                    ws.send("07"+code5);
                                }
                            })()
                        }else{
                            if (BF.includes("LEAVECLAN56565")){
                                var lcv1 = BF.indexOf("{");
                                var lcv2 = BF.indexOf("}");
                                var lc1 = BF.slice(0, lcv1);
                                lc1 = BF.slice(lcv1+1, lcv2);
                                var lcname = lc1;
                                lcv1 = lc1.indexOf("[");
                                lcv2 = lc1.indexOf("]");
                                var lclan = lc1.slice(0, lcv1);
                                lclan = lc1.slice(lcv1+1, lcv2);
                                lcname = lcname.slice(lcv2+1, lcname.length);
                                lclan = lclan.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
                                lcname = lcname.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
                                lcname = lcname.replace(" ","");
                                (async() => {
                                    await remove_to_clan(lclan,lcname);
                                    ws.send("060");
                                    ws.send("070");
                                })()
                            }else{
                                if (BF.includes("UPDATE_CLAN_STATS12321")){
                                    var upd1 = BF.indexOf("{");
                                    var upd2 = BF.indexOf("}");
                                    var up1 = BF.slice(0, upd1);
                                    up1 = BF.slice(upd1+1, upd2);
                                    var uclan = up1;
                                    upd1 = up1.indexOf("[");
                                    upd2 = up1.indexOf("]");
                                    var ustat = up1.slice(0, upd1);
                                    ustat = up1.slice(upd1+1, upd2);
                                    uclan = uclan.slice(upd2+2, uclan.length);
                                    ustat = ustat.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
                                    uclan = uclan.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
                                    (async() => {
                                        await update_clan_stats(ustat,uclan);
                                    })()
                                }else{
                                    if (BF.includes("FIND_USERS_IN_CLAN2345")){
                                        var dpd1 = BF.indexOf("{");
                                        var dpd2 = BF.indexOf("}");
                                        var dp1 = BF.slice(0, dpd1);
                                        dp1 = BF.slice(dpd1+1, dpd2);
                                        dp1 = dp1.replace(/[^a-zA-Z0-9 ]/g, '');
                                        dp1 = dp1.replace(" ", '');
                                        (async() => {
                                            var u_file = await find_all_clanuser(dp1);
                                            ws.send("08"+u_file);
                                        })()
                                    }else{
                                        if (BF.includes("ADD_REQUESTTYT")){
                                            var slic1 = BF.indexOf("{");
                                            var slic2 = BF.indexOf("}");
                                            var slic3 = BF.indexOf("}");
                                            var slice3 = BF.slice(0, slic1);
                                            slice3 = BF.slice(slic1+1, slic2);
                                            var USerN = slice3;
                                            slic1 = slice3.indexOf("[");
                                            slic2 = slice3.indexOf("]");
                                            var lMES = USerN.slice(slic2, slic3);
                                            USerN = slice3.slice(slic1+1, slic2);
                                            USerN = USerN.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
                                            lMES = lMES.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
                                            lMES = lMES + "!";
                                            USerN = USerN.replace(" ","");
                                            (async() => {
                                                const auth = new google.auth.GoogleAuth({
                                                    keyFile: "credentials.json",
                                                    scopes: "https://www.googleapis.com/auth/spreadsheets",
                                                });
                                                    
                                                const client = await auth.getClient();
                                            
                                                const googleSheets = google.sheets({version: "v4", auth: client});
                                                const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
                                                const getRows = await googleSheets.spreadsheets.values.get({
                                                    auth,
                                                    spreadsheetId,
                                                    range: "Main Info!A:A",
                                                }); 
                                                const allName = await getRows.data.values;
                                                var wn = 0;
                                                for ( i=1; i<allName.length; i++ ){
                                                    if (allName[i][0] !== undefined){
                                                        if (allName[i][0] == USerN){
                                                            wn = String(i+1);
                                                            i = allName.length;
                                                        }
                                                    }
                                                }
                                                const getMes = await googleSheets.spreadsheets.values.get({
                                                    auth,
                                                    spreadsheetId,
                                                    range: "Main Info!E"+wn+":E"+wn,
                                                }); 
                                                var MES = await getMes.data.values;
                                                if (MES !== undefined){
                                                    MES[0][0] = MES[0][0]+","+lMES;
                                                }else{
                                                    MES = [[lMES]];
                                                }
                                                await googleSheets.spreadsheets.values.update({
                                                    auth,
                                                    spreadsheetId,
                                                    range: "Main Info!E"+wn+":E"+wn,
                                                    valueInputOption: "USER_ENTERED",
                                                    resource:{
                                                        values: MES,
                                                    },
                                                });
                                            })()
                                        }else{
                                            if (BF.includes("DeleteRequest1M")){
                                                var slic1 = BF.indexOf("{");
                                                var slic2 = BF.indexOf("}");
                                                var slic3 = BF.indexOf("}");
                                                var slice3 = BF.slice(0, slic1);
                                                slice3 = BF.slice(slic1+1, slic2);
                                                var USerN = slice3;
                                                slic1 = slice3.indexOf("[");
                                                slic2 = slice3.indexOf("]");
                                                var lMES = USerN.slice(slic2, slic3);
                                                USerN = slice3.slice(slic1+1, slic2);
                                                USerN = USerN.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
                                                lMES = lMES.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
                                                lMES = lMES + "!";
                                                (async() => {
                                                    const auth = new google.auth.GoogleAuth({
                                                        keyFile: "credentials.json",
                                                        scopes: "https://www.googleapis.com/auth/spreadsheets",
                                                    });
                                                        
                                                    const client = await auth.getClient();
                                                
                                                    const googleSheets = google.sheets({version: "v4", auth: client});
                                                    const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
                                                    const getRows = await googleSheets.spreadsheets.values.get({
                                                        auth,
                                                        spreadsheetId,
                                                        range: "Main Info!A:A",
                                                    }); 
                                                    const allName = await getRows.data.values;
                                                    var wn = 0;
                                                    for ( i=1; i<allName.length; i++ ){
                                                        if (allName[i][0] !== undefined){
                                                            if (allName[i][0] == USerN){
                                                                wn = String(i+1);
                                                                i = allName.length;
                                                            }
                                                        }
                                                    }
                                                    const getMes = await googleSheets.spreadsheets.values.get({
                                                        auth,
                                                        spreadsheetId,
                                                        range: "Main Info!E"+wn+":E"+wn,
                                                    }); 
                                                    var MES = await getMes.data.values;
                                                    var s = 0;
                                                    if (MES !== undefined){
                                                        for ( i=1; i<MES.length; i++ ){
                                                            if (MES[0][i] == lMES){
                                                                s = i;
                                                                i = MES.length;
                                                            }
                                                        }
                                                        MES[0][s] = "";
                                                        if (MES == ""){
                                                            await googleSheets.spreadsheets.values.update({
                                                                auth,
                                                                spreadsheetId,
                                                                range: "Main Info!E"+wn+":E"+wn,
                                                                valueInputOption: "USER_ENTERED",
                                                                resource:{
                                                                    values: [["undefined"]],
                                                                },
                                                            });
                                                        }else{
                                                            await googleSheets.spreadsheets.values.update({
                                                                auth,
                                                                spreadsheetId,
                                                                range: "Main Info!E"+wn+":E"+wn,
                                                                valueInputOption: "USER_ENTERED",
                                                                resource:{
                                                                    values: [[MES]],
                                                                },
                                                            });
                                                        }
                                                    }
                                                })()
                                            }else{
                                                if (BF.includes("389ALLUSER889")){
                                                    (async() => {
                                                        const auth = new google.auth.GoogleAuth({
                                                            keyFile: "credentials.json",
                                                            scopes: "https://www.googleapis.com/auth/spreadsheets",
                                                        });  
                                                        const client = await auth.getClient();
                                                        const googleSheets = google.sheets({version: "v4", auth: client});
                                                        const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
                                                        const getRows = await googleSheets.spreadsheets.values.get({
                                                            auth,
                                                            spreadsheetId,
                                                            range: "Main Info!D:D",
                                                        }); 
                                                        const ALLUSER = await getRows.data.values;
                                                        for ( i=1; i<ALLUSER.length; i++ ){
                                                            index = ALLUSER[i][0];
                                                            if (index !== "NO FILE FOUND" && index !== ""){
                                                                index = JSON.parse(index);
                                                                ws.send("10"+index[0].USERNAME+"/"+String(index[0].STAT_WINS)+"}"+String(index[0].STAT_LOSSES)+"{"+String(index[0].fequip)+"]"+String(index[0].hequip)+"["+String(index[0].bequip)+"+"+String(index[0].sequip)+"-");
                                                            } 
                                                        }
                                                    })()
                                                }else{
                                                    if (BF.includes("DELETECLAN37373")){
                                                        var dca = BF.indexOf("{");
                                                        var dac = BF.indexOf("}");
                                                        var ddcs = BF.slice(0, dca);
                                                        ddcs = BF.slice(dca+1, dac);
                                                        ddcs = ddcs.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
                                                        (async() => {
                                                            await delete_clan(ddcs);
                                                        })()
                                                    }else{
                                                        if (BF.includes("CHANGEPASSWORD12121")){
                                                            var slic1 = BF.indexOf("{");
                                                            var slic2 = BF.indexOf("}");
                                                            var slic3 = BF.indexOf("}");
                                                            var slice3 = BF.slice(0, slic1);
                                                            slice3 = BF.slice(slic1+1, slic2);
                                                            var PASE = slice3;
                                                            slic1 = slice3.indexOf("[");
                                                            slic2 = slice3.indexOf("]");
                                                            var USEA = PASE.slice(slic2, slic3);
                                                            PASE = slice3.slice(slic1+1, slic2);
                                                            PASE = PASE.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
                                                            USEA = USEA.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
                                                            USEA = USEA.replace(" ","");
                                                            (async() => {
                                                                const auth = new google.auth.GoogleAuth({
                                                                    keyFile: "credentials.json",
                                                                    scopes: "https://www.googleapis.com/auth/spreadsheets",
                                                                });
                                                                    
                                                                const client = await auth.getClient();
                                                            
                                                                const googleSheets = google.sheets({version: "v4", auth: client});
                                                                const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
                                                                const getRows = await googleSheets.spreadsheets.values.get({
                                                                    auth,
                                                                    spreadsheetId,
                                                                    range: "Main Info!A:A",
                                                                }); 
                                                                const allName = await getRows.data.values;
                                                                var wn = 0;
                                                                for ( i=1; i<allName.length; i++ ){
                                                                    if (allName[i][0] !== undefined){
                                                                        if (allName[i][0] == USEA){
                                                                            wn = String(i+1);
                                                                            i = allName.length;
                                                                        }
                                                                    }
                                                                }
                                                                await googleSheets.spreadsheets.values.update({
                                                                    auth,
                                                                    spreadsheetId,
                                                                    range: "Main Info!B"+wn+":B"+wn,
                                                                    valueInputOption: "USER_ENTERED",
                                                                    resource:{
                                                                        values: [[PASE]],
                                                                    },
                                                                });
                                                            })()
                                                        }else{
                                                            if (BF.includes("DELETEACCOUNT632t63hd")){
                                                                var DEL = BF.indexOf("{");
                                                                var DEL2 = BF.indexOf("}");
                                                                var DEF = BF.slice(0, DEL);
                                                                DEF = BF.slice(DEL+1, DEL2);
                                                                DEF = DEF.replace(/[^a-zA-Z0-9 ]/g || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '');
                                                                (async() => {
                                                                    const auth = new google.auth.GoogleAuth({
                                                                        keyFile: "credentials.json",
                                                                        scopes: "https://www.googleapis.com/auth/spreadsheets",
                                                                    });
                                                                        
                                                                    const client = await auth.getClient();
                                                                
                                                                    const googleSheets = google.sheets({version: "v4", auth: client});
                                                                    const spreadsheetId = "13037TKM6mFIoVAxRUAa2NaIr5-H5i9Mz-pfuajuKMd4";
                                                                    const getRows = await googleSheets.spreadsheets.values.get({
                                                                        auth,
                                                                        spreadsheetId,
                                                                        range: "Main Info!A:A",
                                                                    }); 
                                                                    const allName = await getRows.data.values;
                                                                    var wn = 0;
                                                                    for ( i=1; i<allName.length; i++ ){
                                                                        if (allName[i][0] !== undefined){
                                                                            if (allName[i][0] == DEF){
                                                                                wn = String(i+1);
                                                                                i = allName.length;
                                                                            }
                                                                        }
                                                                    }
                                                                    await googleSheets.spreadsheets.values.update({
                                                                        auth,
                                                                        spreadsheetId,
                                                                        range: "Main Info!A"+wn+":A"+wn,
                                                                        valueInputOption: "USER_ENTERED",
                                                                        resource:{
                                                                            values: [[""]],
                                                                        },
                                                                    });
                                                                    await googleSheets.spreadsheets.values.update({
                                                                        auth,
                                                                        spreadsheetId,
                                                                        range: "Main Info!B"+wn+":B"+wn,
                                                                        valueInputOption: "USER_ENTERED",
                                                                        resource:{
                                                                            values: [[""]],
                                                                        },
                                                                    });
                                                                    await googleSheets.spreadsheets.values.update({
                                                                        auth,
                                                                        spreadsheetId,
                                                                        range: "Main Info!C"+wn+":C"+wn,
                                                                        valueInputOption: "USER_ENTERED",
                                                                        resource:{
                                                                            values: [[""]],
                                                                        },
                                                                    });
                                                                    await googleSheets.spreadsheets.values.update({
                                                                        auth,
                                                                        spreadsheetId,
                                                                        range: "Main Info!D"+wn+":D"+wn,
                                                                        valueInputOption: "USER_ENTERED",
                                                                        resource:{
                                                                            values: [[""]],
                                                                        },
                                                                    });
                                                                    await googleSheets.spreadsheets.values.update({
                                                                        auth,
                                                                        spreadsheetId,
                                                                        range: "Main Info!E"+wn+":E"+wn,
                                                                        valueInputOption: "USER_ENTERED",
                                                                        resource:{
                                                                            values: [[""]],
                                                                        },
                                                                    });
                                                                })()
                                                            }else{
                                                                if (BF.includes("IGNORETHISBUFFER")){
                                                                    var ok = 0;
                                                                }else{
                                                                    var var5 = BF.indexOf("[");
                                                                    var var6 = BF.indexOf("]");
                                                                    var FFILE = BF.slice(var5, var6+1);
                                                                    save_file(id, FFILE);
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    ws.on("close", () => {
        console.log("> "+JSON.stringify(id)+" disconnect!");
        clients.delete(ws);
    });
});
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}
String.prototype.replaceAt = function (index, char) {
    let a = this.split("");
    a[index] = char;
    return a.join("");
}