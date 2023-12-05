const axios = require("axios");
const {load} =require( "cheerio");
console.log("before");
const baseurl="https://github.com"
const listpath="body > div.logged-out.env-production.page-responsive > div.application-main > main > div.container-lg.p-responsive.mt-6 > ul";

function removeDuplicates(arr) {
    var unique = [];
    for(let i=0; i < arr.length; i++){ 
        if(unique.indexOf(arr[i]) === -1) { 
            unique.push(arr[i]); 
        } 
    }
    return unique;
}

const fetchissues=async (url)=>{
    url=url+'/issues'
    const response=await axios.get(url);
    const $=load(response.data);
    const list=$('div[role="group"]>div').find('div');

    const newarr=[];
    list.each((ind,e)=>{
        let element=$(e).find('div:nth-child(1)>div>a')
        let  text=element.text();
        if(text!=""){let name=$(e).find('div:nth-child(1)>div>a').text();
        let link=baseurl+$(e).find('div:nth-child(1)>div>a').attr('href');

        newarr.push({issue_name:name,issue_link:link});}
    })
     removeDuplicates(newarr);
    
    return newarr;
}
module.exports=fetchissues;
