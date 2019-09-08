var election; //election acts as a pointer to the curently running election

const form = document.querySelector('#add-vote');
var ul;
var items;

// preforms loading functions for main page
function loadindex(){
    ul = document.getElementById("voteList");
    items = ul.getElementsByTagName("li"); 


    db.collection("init").doc("48stPUF65rVtTjnyUXDG").get().then(snapshot => { //gets a snapshot of items in a document
        election = snapshot.data().election;

    }).then(function() {
        // load candidates to webpage:
        db.collection(election).get().then(snapshot => {
            var count = 0; // used to create refs of position
            snapshot.docs.forEach(doc => { 
                // create element atributes:
                var li = document.createElement("li");
                li.className = "human";
                li.draggable = true;
                var dClick = "dClick(" + count + ")";
                var dEnter = "dragEnter(" + count + ")";
                var dStart = "dragStart(" + count + ")";
                li.setAttribute('onclick', dClick, false);
                li.setAttribute('ondragenter', dEnter, false);
                li.setAttribute('ondragstart', dStart, false);
                li.innerHTML = doc.data().name;

                ul.appendChild(li); // add to doc

                count++;
            })
        })

    }).then(function(){
        // Calculates winner:
        db.collection(election).get().then(snapshot => {
            var winner = "";
            var max = 0;

            snapshot.docs.forEach(doc => { 
                if(doc.data().won > 0) { // if there is a winner stop max=-1 stops other if statments
                    winner = doc.data().name; 
                    max = -1}
                if(doc.data().Pvote == max && max != -1){ 
                    winner = "tie"
                } else if(doc.data().Pvote > max && max != -1){ 
                    max = doc.data().Pvote;
                    winner = doc.data().name;
                }
            })
            // write winner to page:
            let h1 = document.createElement('h1');
            let win = document.createElement('span');
            win.textContent = winner;
            h1.appendChild(win);
            theWinner.appendChild(h1);
            
        })
    })
} //*/





var holdName; // placeholder for switching vote order
var placeNum; // gives ref to whitch place to switch

//use click to set majoraty vote:
function dClick(num){
    if(document.getElementsByClassName("human")[num].style.color == "rgb(0, 0, 0)"){
        document.getElementsByClassName("human")[num].style.color = "rgb(140,140,140)";
    } else {
        document.getElementsByClassName("human")[num].style.color = "rgb(0, 0, 0)";
    }
} //*/

//handels dragable list ordering:
function dragStart(num){
    placeNum = num;
}

//Switches positions, and resets ref position:
function dragEnter(num){
    holdName = items[num].innerHTML;
    holdColor = items[num].style.color;

    items[num].innerHTML = items[placeNum].innerHTML;
    items[num].style.color = items[placeNum].style.color;

    items[placeNum].innerHTML = holdName;
    items[placeNum].style.color = holdColor;

    placeNum = parseInt(num);
}





//when vote is cast:
function addVote() {

    var candidates1 = 3;
    var hitCan;  
    var obj = {};
    var key = "";
    var it = 0;
    var won = 1;
    db.collection(election).get().then(snapshot => {
        snapshot.docs.forEach(doc => { 
            hitCan = -1;
            obj = {};
            Pvote = doc.data().Pvote;
            won = 1;
            for (var i = 0; items.length > i; i++) {

                if(items[i].innerHTML == doc.data().name){ // names above --1, and below ++1
                    hitCan = 1;

                    if(items[i].style.color == "rgb(0, 0, 0)"){ // used to calculate popular vote
                        Pvote += 1;
                    } 
                }
                else if(items[i].innerHTML != ""){ // if you win all elections you are a winner
                    key = items[i].innerHTML;
                    obj[key] = doc.data().votes[items[i].innerHTML] + hitCan;
                    if(doc.data().votes[items[i].innerHTML] + hitCan < 1){
                        won = -1;
                    }
                }
    
            }

            db.collection(election).doc(doc.id).update({ // update the document
                votes: obj,
                won: won,
                Pvote: Pvote
            })
        })
    })
} //*/







// ----------------------------------------------------admin.js---------------------------------------------------------

function loadadmin(){
    
}





//changes what election is running:
function hit(){
    var newE = document.getElementById("sElec").value;
    db.collection("init").doc("48stPUF65rVtTjnyUXDG").set({
        election: newE
    })
}

//adds candidate to an election
function addCandidit() {
    var candidate = document.getElementById("candidate").value;;
    var election = document.getElementById("election").value;

    db.collection(election).get().then(snapshot => {
        var obj = {};
        var votes = {};
        // adds candidat to other docs:
        snapshot.docs.forEach(doc => { 
            votes[doc.data().name] = 0;
            obj = doc.data().votes;
            obj[candidate] = 0;

            db.collection(election).doc(doc.id).update({
                votes: obj
            })         
        })
        // creates candidate doc:
        db.collection(election).doc().set({  
            votes: votes,
            won: 0,
            Pvote: 0,
            name: candidate
        })   
    })
}

//reset election:
function reSet() {
    var election = document.getElementById("sElec").value;

    db.collection(election).get().then(snapshot => {
        snapshot.docs.forEach(doc => { 
            var obj = doc.data().votes;
            Object.keys(obj).forEach(function (item) {
                obj[item] = 0; // sets each mini election to 0
            });   
            console.log(obj);
            db.collection(election).doc(doc.id).update({
                votes: obj,
                won: 0,
                Pvote: 0
            })   

        })   
    })
}

//removes candidates
function remCan(){
    var election = document.getElementById("election").value;
    var candidate = document.getElementById("candidate").value;

    db.collection(election).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            if(doc.data().name != candidate){
                var obj = doc.data().votes;
            
                delete obj[candidate];
                console.log(obj);
                db.collection(election).doc(doc.id).update({
                    votes: obj
                })
            } else{
                db.collection(election).doc(doc.id).delete();
            }
        })   
    })
}

function addElection(){
    var election = document.getElementById("sElec").value;
    db.collection(election).doc().set({
        name: "init"
    });
    console.log("hi")

}



