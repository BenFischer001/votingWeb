const form = document.querySelector('#add-vote');

var ul = document.getElementById("voteList");
var items = ul.getElementsByTagName("li");


// load candidates:
db.collection('president').get().then(snapshot => {
    var count = 0; // used to create refs of position
    snapshot.docs.forEach(doc => { 
        // create element atributes:
        var li = document.createElement("li");
        li.className = "human";
        li.draggable = true;
        var dEnter = "dragEnter(" + count + ")";
        var dStart = "dragStart(" + count + ")";
        li.setAttribute('ondragenter', dEnter, false);
        li.setAttribute('ondragstart', dStart, false);
        li.innerHTML = doc.data().name;

        ul.appendChild(li); // add to doc

        count++;
    })
})

var holdName; // placeholder for switching vote order
var placeNum; // gives ref to whitch place to switch

//handels dragable list ordering
function dragStart(thiis){
    placeNum = thiis;
}

//Switches positions, and resets ref position
function dragEnter(num){
    holdName = items[num].innerHTML;
    items[num].innerHTML = items[placeNum].innerHTML;
    items[placeNum].innerHTML = holdName;
    placeNum = parseInt(num);
}


// create element & render
// getting data
db.collection('president').get().then(snapshot => {
    var winner = "";

    snapshot.docs.forEach(doc => {  
        if(doc.data().won > 0) {
            winner = doc.data().name; }
    })

    let h1 = document.createElement('h1');
    let win = document.createElement('span');
    win.textContent = winner;
    h1.appendChild(win);
    theWinner.appendChild(h1);
    
})


//when vote is cast:
function addVote() {

    var candidates1 = 3;
    var hitCan;  
    var obj = {};
    var key = "";
    var it = 0;
    var won = 1;
    db.collection('president').get().then(snapshot => {
        snapshot.docs.forEach(doc => { 
            hitCan = -1;
            obj = {};
            won = 1;
            for (var i = 0; items.length > i; i++) {

                if(items[i].innerHTML == doc.data().name){
                    //console.log(vote.value);
                    hitCan = 1;
                }
                else if(items[i].innerHTML != ""){
                    key = items[i].innerHTML;
                    obj[key] = doc.data().votes[items[i].innerHTML] + hitCan;
                    if(doc.data().votes[items[i].innerHTML] + hitCan < 1){
                        won = -1;
                    }
                }
    
            }
            //console.log(doc.data().name);
            //console.log(obj);
            db.collection('president').doc(doc.id).update({
                votes: obj,
                won: won
            })
            //console.log(doc.data().votes);
        })
    })
} //*/









