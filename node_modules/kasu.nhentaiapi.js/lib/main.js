"use strict";
const cheerio = require("cheerio")
const fetcher = require("./src/fetcher")
const shorter = require("./src/shorter")
const url = "https://nhentai.net/"

function randrange(int) {if (typeof (int) != 'number') throw 'input value is not an integer!';return Math.floor(Math.random()*int)+1}
async function linkRandomizer(type,string,$){
    let web;
    try{
        web = cheerio.load(await fetcher(`${url}${type}/${string}/?page=${randrange(parseInt($("a[class='last']").attr("href").replace(`/${type}/${string}/?page=`, "")))}`))
    } catch(err){
        web = cheerio.load(await fetcher(`${url}${type}/${string}/?page=1`))
    }
    return web(`div.index-container>div:nth-child(${randrange(parseInt(web("div[class='container index-container']>div>a").length))})>a`).attr("href").slice(3, 100).replace("/", "")
}
//shortcutter functions
let pRCL=async(tag,string)=>{return cheerio.load(await fetcher(`${url}${tag}/${string}/`))};
let replacer=(str,rpl)=>{return str.replace(/ /g,rpl)};
let lId=(id)=>{return{link:`${url}g/${id}`,id:id}};

class main {
    constructor(){
        // Only used when using this API on discord bots
        this.IsDiscord=false;
        // run the code again if it fails
        this.ReRollonFail=false;
    }
    
    //hidden function/ more like a private function
    async #pRandDataGiver($,string,tag,data,bool,tag2,spTag,spLink){
        if(bool)throw(  `"${string}", does not exist in the ${tag2} section!`)
        let link=spLink;
        if(!spTag)link = await linkRandomizer(tag2,string,$)
        if(!data)return lId(link);
        try{
            return data(await shorter(link, this.IsDiscord,this.ReRollonFail, string))
        } catch(e) {
            if(this.ReRollonFail){
                if(!/DISCORD ToS: REROLL DENIED/.test(e))return eval(`this.${tag}(string, data)`)
                throw e
            } else throw e
        }
    }

    getID(ID) {
        //transformation
        /[${url}g/]/.test(ID)?ID=parseInt(ID.replace(`${url}g/`,"")):typeof(ID)!='number'?ID=parseInt(ID):null;
        return {
            json: async (data) => {
                const list = await shorter(ID,this.IsDiscord)
                if(data) return data(list)
                return list
            }
        }
    }

    //generate ID only. An Existing doujin ID. Doesn't give the data.
    async pRandID(){
        const $ = await pRCL("random","/")
        return $("#gallery_id").text().slice(1, 100)
    }

    //multiple arg use
    async pRandSpecificTags(string, data) {
        try{ string = replacer(string,"+") }catch(e){}
        const $ = cheerio.load(await fetcher(`${url}search/?q=${string}/`))
        if ($('div.index-container>h2').text() == "No results found") {
            throw( `"${string}", No results!`)
        } else {
            let page;
            try{page = randrange(parseInt($("a[class='last']").attr("href").split("&")[1].replace("page=", "")))} catch(err){page = 1;}
            const $2 = cheerio.load(await fetcher(`${url}search/?q=${string}&page=${page}`))
            const link = $2(`div.index-container>div:nth-child(${randrange(parseInt($2("div[class='container index-container']>div>a").length))})>a`).attr("href").slice(3, 100).replace("/", "")
            if (!data) {
                return lId(link);
            } else return await this.#pRandDataGiver('',string,"pRandSpecificTags",data,'','',true,link)
        }
    }

    //one arg use | spelling sensitive
    async pRandTag(string, data) {
        string = replacer(string,"-")
        const $ = await pRCL("tag",string)
        const bool = $('title').text().slice(0, 3) == "404";
        return await this.#pRandDataGiver($,string,"pRandTag",data,bool,"tag")
    }

    //one arg use | spelling sensitive
    async pRandParody(string, data) {
        string = replacer(string,"-")
        const $ = await pRCL("parody",string)
        const bool = $('title').text().slice(0, 3) == "404";
        return await this.#pRandDataGiver($,string,"pRandParody",data,bool,"parody")
    }

    //one arg use | spelling sensitive
    async pRandArtist(string, data) {
        string = replacer(string,"-")
        const $ = await pRCL("artist",string)
        const bool = $('title').text().slice(0, 3) == "404";
        return await this.#pRandDataGiver($,string,"pRandArtist",data,bool,"artist")
    }

    //one arg use | spelling sensitive
    async pRandGroup(string, data) {
        string = replacer(string,"-")
        const $ = await pRCL("group",string)
        const bool = $('title').text().slice(0, 3) == "404";
        return await this.#pRandDataGiver($,string,"pRandGroup",data,bool,"group")
    }

    async pRandom(data) {
        const $ = await pRCL("random","/")
        const dataId = $("#gallery_id").text().slice(1, 100)
        if (!data) {
            return lId(dataId);
        } else {
            try{
                return data(await shorter(dataId, this.IsDiscord,this.ReRollonFail))
            } catch(e) {
                return this.pRandom(data)
            }
        }
    }

}
module.exports = main;