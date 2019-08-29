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

var holdName; // placeholder for switching vote order
var placeNum; // gives ref to whitch place to switch

//use double click to set majoraty vote
function dClick(num){
    if(document.getElementsByClassName("human")[num].style.color == "rgb(0, 0, 0)"){
        document.getElementsByClassName("human")[num].style.color = "rgb(140,140,140)";
    } else {
        document.getElementsByClassName("human")[num].style.color = "rgb(0, 0, 0)";
    }
    //items[num].style.color = blue;
} //*/

//handels dragable list ordering
function dragStart(num){
    placeNum = num;
}

//Switches positions, and resets ref position
function dragEnter(num){
    holdName = items[num].innerHTML;
    holdColor = items[num].style.color;

    items[num].innerHTML = items[placeNum].innerHTML;
    items[num].style.color = items[placeNum].style.color;

    items[placeNum].innerHTML = holdName;
    items[placeNum].style.color = holdColor;

    placeNum = parseInt(num);
}


// create element & render
// getting data
db.collection('president').get().then(snapshot => {
    var winner = "";
    var max = 0;

    snapshot.docs.forEach(doc => { 
        if(doc.data().won > 0) {
            //console.log(winner);
            winner = doc.data().name; 
            max = -1}
        if(doc.data().Pvote == max && max != -1){
            winner = "tie"
        } else if(doc.data().Pvote > max && max != -1){
            max = doc.data().Pvote;
            winner = doc.data().name;
        }
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
            Pvote = doc.data().Pvote;
            won = 1;
            for (var i = 0; items.length > i; i++) {

                if(items[i].innerHTML == doc.data().name){
                    //console.log(vote.value);
                    hitCan = 1;

                    if(items[i].style.color == "rgb(0, 0, 0)"){
                        Pvote += 1;
                    } 
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
                won: won,
                Pvote: Pvote
            })
            //console.log(doc.data().votes);
        })
    })
} //*/









