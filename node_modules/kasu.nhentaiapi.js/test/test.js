"use strict";
const API = require("../lib/main.js")
const {exec} = require("child_process");
let api = new API();

const log = (...string)=>{
    return console.log(...string);
}

// excess test are removed after build only important remains
(async ()=>{
    log(`   testing '.js' files: main.js`)
    exec("node lib/main.js",(e,o,r)=>{log(o+r+'main.js done')})
    log(`   testing '.js' files: fetcher.js`)
    exec("node lib/src/fetcher.js",(e,o,r)=>{log(o+r+'fetcher.js done')})
    log(`   testing '.js' files: shorter.js`)
    exec("node lib/src/shorter.js",(e,o,r)=>{log(o+r+'shorter.js done')})
    const test = await api.getID(177013).json()
    log(`\ngetID().json():\n`)
    log(test)
    //should show a whole json
    log(`\n==========================================================\n`)

    api.IsDiscord = true;
    // pRand Test
    log(`pRandSpecificTags:\n`)
    await api.pRandSpecificTags("konosuba aqua sole-female",data=>{
        log(data)
    })

    api.ReRollonFail = true;
    log(`\npRandTag: -crossdressing-\n`)
    await api.pRandTag("crossdressing",(data)=>{log(data)}) 
    log(`\npRandTag: -lolicon-\n`)
    try{
        await api.pRandTag("lolicon",(data)=>{log(data)}) // should cause and error
    } catch(e) {
        log(e)
    }

    log(`\n==========================================================\n`)
})();
