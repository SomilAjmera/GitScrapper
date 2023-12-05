const axios = require( "axios");
const {load} =require( "cheerio");
const fetchissue = require("./repopage")
const xlsx=require('xlsx');
const fs=require('fs');
const baseurl="https://github.com"
const url="https://github.com/topics/json"
const listpath="body > div.logged-out.env-production.page-responsive > div.application-main > main > div.container-lg.p-responsive.mt-6 > ul";
const readfile=(workbookname,sheetname)=>{
    if(!fs.existsSync(workbookname)){
         console.log("no-file-present");
         return [];
    }
    let wb=xlsx.readFile(workbookname);
    let exceldata=wb.Sheets[sheetname]; 
    
    let ans=xlsx.utils.sheet_to_json(exceldata);
    console.log(ans)
    return ans;
}
const writefile=(topic,repo,data)=>{
    if(!fs.existsSync(`${topic}.xlsx`)){
        console.log("no-file-present");
        let newWb=xlsx.utils.book_new()
    let newWs=xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(newWb,newWs,repo);
    xlsx.writeFile(newWb,`${topic}.xlsx`)
   }
   else{
     
     const wb = xlsx.readFile(`${topic}.xlsx`)
     let newWs=xlsx.utils.json_to_sheet(data);
      xlsx.utils.book_append_sheet(wb,newWs,repo);
      xlsx.writeFile(wb,`${topic}.xlsx`);


   }
    
}

const  repolistpage=async (url,topic)=>{

    const response=await axios.get(url);
    const $=load(response.data);
    const list=$('body > div.logged-out.env-production.page-responsive > div.application-main > main > div:nth-child(2) > div.topic.p-responsive.container-lg > div > div.col-md-8.col-lg-9 > article');
    for(let i=0;i<8;i++){
        let e=list[i];
        let link=$(e).find('div.px-3 > div > div.d-flex.flex-1 > h3 > a.text-bold.wb-break-word').attr('href')

    
    
    let reponame=link.split('/')[2];
    let repoauthor=link.split('/')[1];

       let repolink=baseurl+link;      
      const data= await fetchissue(repolink);

      writefile(topic,reponame,data)

      console.log("topic_name->"+topic+" reponame->"+reponame);
      console.log('\n');
        
    }
    




}
module.exports=repolistpage;
