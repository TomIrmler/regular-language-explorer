var G = {
    "N" : [],
    "T" : [],
    "S" : null,
    "P" : {},
    "direction" : "rr"
};

var control_panel;
var kh_container;

function addElement(letter, element){
    if (!(element === "" || element == null || G[letter].includes(element))){
        G[letter].push(element);
        render_editor(letter);

        if (letter == "N"){
            render_S_editor();
            G.P[element] = [];
        }

        render_P_editor();
    }
}

function render_editor(letter){
    

    var editor = document.createElement("div")
    editor.setAttribute("id", letter + "_editor")

    var textbracket_open = document.createElement("p")
    textbracket_open.setAttribute("class", "textbracket_"+letter+" textbracket_open textbracket");
    textbracket_open.innerText = letter+" = {"

    var textbracket_close = document.createElement("p")
    textbracket_close.setAttribute("class", "textbracket_"+letter+" textbracket_close textbracket");
    textbracket_close.innerText = "}"

    editor.appendChild(textbracket_open)

    var elementBoxWrapper = document.createElement("div");
    elementBoxWrapper.setAttribute("class", "elementBoxWrapper")

    G[letter].forEach(element => {
        var elementBox = document.createElement("div");
        elementBox.setAttribute("class","elementBox");
        elementBox.innerText = element;
        elementBoxWrapper.appendChild(elementBox);

        var kommaBox = document.createElement("div");
        kommaBox.setAttribute("class", "kommaBox");
        kommaBox.innerText = ",";
        elementBoxWrapper.appendChild(kommaBox)
    });

    editor.appendChild(elementBoxWrapper)

    var elementAdderBox = document.createElement("div");
    elementAdderBox.setAttribute("class", "elementAdderBox")
    
    var namingField = document.createElement("input")
    namingField.setAttribute("class", "namingField")
    namingField.setAttribute("type", "text")
    namingField.setAttribute("size", 5)
    elementAdderBox.appendChild(namingField)
    
    var addingButton = document.createElement("button")
    addingButton.setAttribute("class", "addingButton")
    addingButton.setAttribute("type", "button")
    addingButton.onclick = function(){addElement(letter, namingField.value)}
    addingButton.innerText = "+"
    elementAdderBox.appendChild(addingButton)

    editor.appendChild(elementAdderBox)

    editor.appendChild(textbracket_close)
    
    var old_editor = document.getElementById(letter + "_editor")
    if (old_editor){
        control_panel.replaceChild(editor, old_editor)
    } else {
        control_panel.appendChild(editor)
    }

};


function render_S_editor(){

    function removeAll(selectBox) {
        while (selectBox.options.length > 0) {
            selectBox.remove(0);
        }
    }

    var S_editor = document.createElement("div")
    S_editor.setAttribute("id", "S_editor")

    var textbracket_open = document.createElement("p")
    textbracket_open.setAttribute("class", "textbracket_S textbracket_open textbracket");
    textbracket_open.innerText = "S = "

    S_editor.appendChild(textbracket_open);

    var S_selector = document.createElement("select");
    S_selector.name = "S_selector";
    S_selector.id = "S_selector";
    S_selector.onchange = function() {G.S = this.value; render_P_editor();}
    removeAll(S_selector)

    if (G.N.length > 0)  {
        G.N.forEach(nichtTerminal =>{
            S_selector.add(
                new Option(nichtTerminal, nichtTerminal)
            )
        });
        G.S = G.N[0];

    } else {
        S_selector.add(new Option("-----", "empty"))
        G.S = null
        S_selector.disabled = true;
    }

    S_editor.appendChild(S_selector)
    
    var old_S_editor = document.getElementById("S_editor")
    if (old_S_editor){
        control_panel.replaceChild(S_editor, old_S_editor)
    } else {
        control_panel.appendChild(S_editor)
    }
};

function render_dir_editor(){
    var dir_editor = document.createElement("div")
    dir_editor.setAttribute("id", "dir_editor");

    [["rr", "rechts-regulär"], ["lr", "links-regulär"]].forEach(paar => {
        var set = document.createElement("div");
        set.id = "set_"+paar[0];
        set.classList.add("radio_set");
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.id = paar[0];
        radio.name = "direction";
        radio.value = paar[0];
        radio.addEventListener("change", function(){
            G.direction = paar[0]
            Object.keys(G.P).forEach(nichtTerminal => {
                G.P[nichtTerminal] = []; 
            });
            render_P_editor();
            document.getElementById("kh_button").disabled = true;

        })
        if (paar[0] == G.direction){
            radio.checked = true;
        }
        var lable = document.createElement("lable");
        lable.for = paar[0]
        lable.innerText = paar[1]
        set.appendChild(radio)
        set.appendChild(lable)
        dir_editor.appendChild(set)
    });

    control_panel.appendChild(dir_editor)
};

function render_P_editor(){

    var textbracket_open = document.createElement("p")
    textbracket_open.setAttribute("class", "textbracket_P textbracket_open textbracket");
    textbracket_open.innerText = "P = {"

    var textbracket_close = document.createElement("p")
    textbracket_close.setAttribute("class", "textbracket_P textbracket_close textbracket");
    textbracket_close.innerText = "}"

    var P_editor = document.createElement("div")
    P_editor.id =  "P_editor"

    P_editor.appendChild(textbracket_open)

    if (Object.keys(G.P).length > 0 && G.N.length > 0 && G.T.length > 0 && !(G.S == null) ) {

        var showing_order_N_list = G.N
        showing_order_N_list.splice(showing_order_N_list.indexOf(G.S),1)
        showing_order_N_list.unshift(G.S);

        showing_order_N_list.forEach(nichtTerminal => {
            var pv_row = document.createElement("div")
            pv_row.setAttribute("class", "pv_row")

            var leftSide = document.createElement("p")
            leftSide.setAttribute("class", "pv_left_side")
            leftSide.innerText = nichtTerminal;

            var arrow = document.createElement("p")
            arrow.setAttribute("class", "pv_arrow")
            arrow.innerText = "\u2192"

            var rightSideBox = document.createElement("div")
            rightSideBox.setAttribute("class", "right_side_box")

            pv_row.appendChild(leftSide)
            pv_row.appendChild(arrow);

            G.P[nichtTerminal].forEach(zuweisung => {
                var elementBox = document.createElement("div")
                elementBox.setAttribute("class", "pv_elementBox")

                var displayed_folge_nt

                if (zuweisung.folge_nt == "[ende]"){
                    displayed_folge_nt = ""
                } else {
                    displayed_folge_nt = zuweisung.folge_nt
                }
                
                if (G.direction == "rr"){
                    elementBox.innerText = zuweisung.terminal+displayed_folge_nt 
                } else {
                    elementBox.innerText = displayed_folge_nt+zuweisung.terminal
                }
                rightSideBox.appendChild(elementBox)
                if (G.P[nichtTerminal].length > 1){
                    var pipeBox = document.createElement("div");
                    pipeBox.setAttribute("class", "pipeBox");
                    pipeBox.innerText = "|";
                    rightSideBox.appendChild(pipeBox) 
                }
            });


            var pv_inputBox = document.createElement("div")
            pv_inputBox.setAttribute("class", "pv_inputBox")
            
            var terminal_selector = document.createElement("select")
            terminal_selector.setAttribute("class", "pv_terminal_selector");
            
            G.T.forEach(terminal => {
                terminal_selector.add(new Option(terminal, terminal))
            });

            var folge_nt = showing_order_N_list[showing_order_N_list.indexOf(nichtTerminal)+1]
            if (folge_nt == undefined){
                folge_nt = "[ende]"
            }

            var folge_nt_selector = document.createElement("select")
            folge_nt_selector.setAttribute("class", "folge_nt_selector");
            showing_order_N_list.concat(["[ende]"]).forEach(nichtterminal => {
                var newoption = new Option(nichtterminal, nichtterminal)
                if (nichtterminal == folge_nt){
                    newoption.selected = "selected"
                }
                folge_nt_selector.add(newoption)
            });

            switch (G.direction){
                case "rr":
                    rightSideBox.appendChild(terminal_selector)
                    rightSideBox.appendChild(folge_nt_selector)
                    break;

                case "lr":
                    rightSideBox.appendChild(folge_nt_selector)
                    rightSideBox.appendChild(terminal_selector)
                    break;
            }
            

            var addingButton = document.createElement("button")
            addingButton.setAttribute("class", "pv_addingButton")
            addingButton.innerText = "+";
            addingButton.onclick = function(){
                var v_to_add = {"terminal" : terminal_selector.value, "folge_nt": folge_nt_selector.value}
                if (!(pv_list_includes(v_to_add, nichtTerminal))) {
                    G.P[nichtTerminal].push(v_to_add);
                    render_P_editor();
                }
                document.getElementById("kh_button").disabled = false;
                
            }

            rightSideBox.appendChild(addingButton)

            pv_row.appendChild(rightSideBox)

            P_editor.appendChild(pv_row)

        });

    } else {
        var error_message = document.createElement("p")
        error_message.innerText = "Es fehlt mindestens ein nötiger Eingabewert."
        P_editor.appendChild(error_message)
    }

    P_editor.appendChild(textbracket_close)

    var old_P_editor = document.getElementById("P_editor")
    if (old_P_editor){
        control_panel.replaceChild(P_editor, old_P_editor)
    } else {
        control_panel.appendChild(P_editor)
    }
};

function pv_list_includes(v_to_add, nichtTerminal){
    var included = false 
    G.P[nichtTerminal].forEach(pv => {
        if (pv.terminal == v_to_add.terminal && pv.folge_nt == v_to_add.folge_nt){
            console.log("nein")
            included = true 
        }
    });
    return included 
}

function render_kh_controls(){
    var kh_control = document.createElement("div")
    kh_control.id = "kh_control"

    var kh_lable = document.createElement("lable")
    kh_lable.id = "kh_lable"
    kh_lable.for = "kh_button"
    kh_lable.innerText = "Mögliche Worte:"
    var kh_button = document.createElement("button")
    kh_button.id = "kh_button"
    kh_button.name = "kh_button"
    kh_button.innerText = "generieren"
    kh_button.disabled = true;
    kh_button.onclick = function(){ generate_kh() }

    kh_control.appendChild(kh_lable)
    kh_control.appendChild(kh_button)
    kh_container.appendChild(kh_control)
}

function generate_kh(){
    var kh_array = solve_pv(G.S)
    var kh = kh_array.join(", ")
    
    var kh_textblock = document.createElement("p")
    kh_textblock.id = "kh_textblock";
    kh_textblock.innerText = "{ "+ kh+ " } Anzahl: " + kh_array.length;

    var old_kh_textblock = document.getElementById("kh_textblock")
    if (old_kh_textblock){
        kh_container.replaceChild(kh_textblock, old_kh_textblock)
    } else {
        kh_container.appendChild(kh_textblock)
    }
}

function solve_pv(start_nt, word = "", wordlist = []){

    G.P[start_nt].forEach(outcome => {
        var terminal = outcome["terminal"];
        var folge_nt = outcome["folge_nt"];
        if (!(folge_nt == "[ende]")){
            console.log("rein in", folge_nt)
            switch (G.direction){
                case "rr":
                    wordlist = solve_pv(folge_nt, word+terminal, wordlist);
                    break;
                case "lr":
                    wordlist = solve_pv(folge_nt, terminal+word, wordlist);
                    break;
            }
            console.log("zurück aus", folge_nt)
        } else {
            switch (G.direction){
                case "rr":
                    wordlist.push(word+terminal);
                    console.log(word+terminal, "gepushed bei", folge_nt)
                    break;
                case "lr":
                    wordlist.push(terminal+word);
                    console.log(terminal+word, "gepushed bei", folge_nt)
                    break;
            }
        }         
    });  
    console.log(wordlist)
    return wordlist
}


function render_ui(){
    control_panel = document.createElement("div")
    control_panel.setAttribute("id", "control_panel")
    render_editor("N");
    render_editor("T");
    render_S_editor();
    render_dir_editor();
    render_P_editor();
    
    kh_container = document.createElement("div")
    kh_container.id = "kh_container"

    render_kh_controls(); 

    var wrapper = document.getElementById("wrapper")
    wrapper.appendChild(control_panel)
    wrapper.appendChild(kh_container)

};