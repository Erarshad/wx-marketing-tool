let figlet = require('figlet');
let prompt=require('prompt-sync')();
const load_progress = require('cli-progress');
//-----------------------------------
// wp api setup
const qrcode = require('qrcode-terminal');

const fs = require('fs');
const { Client, LegacySessionAuth } = require('whatsapp-web.js');

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
    authStrategy: new LegacySessionAuth({
        session: sessionData
    })
});

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
// Save session values to the file upon successful auth

client.on('ready', trap => {
    console.log('Client is ready!');

    
});

const loader = new load_progress.SingleBar({},load_progress.Presets.rect);

// start the progress bar with a total value of 200 and start value of 0
loader.start(0, 99);

// update the current value in your application..


// stop the progress bar




//--------------------------------------

let load_status=client.initialize();
  
    for(let i=0;i<=100;i++){
        
        loader.update(i);

    }

    load_status.then(function(data){
        loader.stop();
       
        figlet('Wx-Marketing tool', function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(data)
            

            handle_menu();
        });



    });
    load_status.catch(function(err){
        console.log(err+"");

    });


    //-----------



   
    function handle_menu(){
        
        console.log("Please choose options:"+"✨");
        console.log("press 1: for "+"bulk message");
        console.log("press 2: for "+"automating replies");
        console.log("press 3: Reset application")
        console.log("press 4: About")
      
      
        let choice=prompt("enter the selected menu: ");
        
        handle_choice(parseInt(choice.trim()));




    }

    function handle_choice(choice){

        switch(choice){
            case 1: {
                console.log("welcome to bulk wp-messaging service");
                handle_bulk();
                break;
            }
            case 2:  {
                console.log("Welcome to automation service");
                setup_automation();


                break;
            }
            case 3:{
                try{
                fs.unlinkSync("./session.json");
                console.log("successfully reseted application");
                process.exit();        
                }catch(e){
                    
                    console.log(e);
                    process.exit(); 
                }
                break;
            }
            case 4:{
                console.log("\tDesign and developed by Mohammad Arshad\t\tAvailable for windows,mac,linux");
                break;
            }

            default: {
                console.log("Thanks for using, MADE IN INDIA by Mohammad Arshad we are open source");

            }
        }


    }

    //-----------for bulk message 

    function handle_bulk(){
    
      
       
      let n = prompt("how many number you wanted to add it? ")
       let time=  prompt("how many time you wanted to repeat at each contact?  ");
       console.log("Donot forget to add countrycode without any character such as +");
       console.log("seprate it with `,`");
       let number=prompt("enter numbers (comma separated): ");
       let msg=prompt("enter message that you wanted to send: ");
       if(time && number && msg){
        operate_bulk_msg(time,number,msg);
       }else{
           console.log("You may miss any of these values during input, try again");
           process.exit();
       }
       



    }

   
    function operate_bulk_msg(time,str,msg){
        let number=[];
        number=str.split(",");
        number.forEach(item => {
            let id=""+item+"@c.us";
            for(let i=0;i<time;i++){
            client.sendMessage(id,msg);
            }
        });
        console.log("bulk message get completed");

       

    }


    function setup_automation(){
       let n_of_query= prompt("enter the how many queries do you wanted to add ");
       if(!n_of_query){
           console.log("you have missed any input field, that will lead to program crash, please try again -1");
           process.exit();
       }
       let trigger_table=new Map();
       for(let i=0;i<n_of_query;i++){
           let triggering_txt=prompt("enter the text in which you wanted to respond: ").trim();

           let reacter_txt=prompt("enter your counter text to respond: ").trim();
           if(triggering_txt && reacter_txt){
           trigger_table.set(triggering_txt,reacter_txt);  
           }else{
               console.log("you missed any input field, please try again");
               process.exit();
           } 
       }
       
       client.on('message', message => {
        console.log("msg is "+ message.body);
        let msg=message.body.trim();
        
       
        let reply_txt=trigger_table.get(msg);
        if(reply_txt)
            message.reply(reply_txt);
        console.log("Server will keep listening upcoming text to automate replies: ");


    
        //---------------------------------
        
        let rec_promise=message.getContact();
        rec_promise.then(function(data){
            console.log(data.number+" : name is "+data.name);
        
            
    
        });
        rec_promise.catch(function(err){
          console.log(err+"");
        });
    
        
        
        
    
    
    
    });
    



      
    }
        


   




