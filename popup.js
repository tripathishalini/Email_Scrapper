let scrapeEmails=document.getElementById('scrapeEmails');
let list=document.getElementById('emailList');
//handler to receive emails from content script
chrome.runtime.onMessage.addListener((request,
    sender,sendResponse)=>{
        //Get emails
        let emails=request.emails;
        //Display emails on popup
        if(emails==null || emails.length==0){
            //no emails
            let li=document.createElement("li");
            li.innerText="No emails found";
            list.appendChild(li);
        }
        else{
            //display emails
            emails.forEach((email)=>{
                let li=document.createElement('li');
                li.innerText=email;
                list.appendChild(li);
            });
        }
    });
scrapeEmails.addEventListener("click",async()=>{
    //alert("hello");
    // chrome scripting api
    // get current active tab
    let [tab] =  await chrome.tabs.query({active: 
         true, currentWindow: true});
    // // execute script to parse emails on page
     chrome.scripting.executeScript({
         target: {tabId: tab.id},
        func: scrapeemailsFromPage,

     });

})
//function to scrape emails
 function scrapeemailsFromPage(){
    //alert('hi');
    //RegEx to parse emails from html code
    const emailRegEx= /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;
    //parse emails from the html of the page
    let emails=document.body.innerHTML.match(emailRegEx);
    //alert(emails);
    chrome.runtime.sendMessage({emails});
}