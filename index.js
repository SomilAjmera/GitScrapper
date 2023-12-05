const axios=require('axios');
const {load} =require("cheerio");
const repolist=require("./repolist.js")
const xlsx=require('xlsx');
console.log("before");
const baseurl="https://github.com"
const url="https://github.com/topics"
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
    if(!fs.existsSync(workbookname)){
        console.log("no-file-present");
        let newWb=xlsx.utils.book_new()
    let newWs=xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(newWb,newWs,repo);
    xlsx.writeFile(newWb,`${topic}.xlsx`)
   }
   else{
     
     const file = xlsx.readFile(`${topic}.xlsx`)
      xlsx.utils.book_append_sheet(file,data,repo)

   }
    
}



(async ()=>{

    const response=await axios.get(url);
    const $=load(response.data);
    const list=$(listpath).find('li');
  
    list.each(async (_,e)=>{
        
        let url=$(e).find('a').attr('href');
        let topicname=url.split('topics/')[1];
        // console.log('topicname->'+topicname);
        let topicurl=baseurl+$(e).find('a').attr('href');
        await repolist(topicurl,topicname)
        
    });
  




})();




  // let topic="jquery";
    // let repo ="myrepo";
    // let data=[{name:"Shreyansh"},{name:"abc"}];
    // writefile(topic,repo,data);
    // const ans=readfile();






console.log("After");
