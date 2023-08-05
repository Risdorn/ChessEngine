function restart() {
    let board = Array(64).fill(-1);
    board[0] = 39;
    board[1] = 41;
    board[2] = 42;
    board[3] = 43;
    board[4] = 44;
    board[5] = 42;
    board[6] = 41;
    board[7] = 39;
    board[8] = 51;
    board[9] = 51;
    board[10] = 51;
    board[11] = 51;
    board[12] = 51;
    board[13] = 51;
    board[14] = 51;
    board[15] = 51;

    board[56] = 69;
    board[57] = 71;
    board[58] = 72;
    board[59] = 73;
    board[60] = 74;
    board[61] = 72;
    board[62] = 71;
    board[63] = 69;
    board[48] = 61;
    board[49] = 61;
    board[50] = 61;
    board[51] = 61;
    board[52] = 61;
    board[53] = 61;
    board[54] = 61;
    board[55] = 61;
    for(let i = 0; i < 16; i += 1){
        let black = document.getElementById(i);
        let white = document.getElementById(i+48);
        black.style.cursor = "pointer";
        white.style.cursor = "pointer";
        black.addEventListener("click", show_valid_path);
        white.addEventListener("click", show_valid_path);
    }
    document.getElementById("Rook_black").addEventListener("click", promotion);
    document.getElementById("Knight_black").addEventListener("click", promotion);
    document.getElementById("Bishop_black").addEventListener("click", promotion);
    document.getElementById("Queen_black").addEventListener("click", promotion);
    document.getElementById("Rook_white").addEventListener("click", promotion);
    document.getElementById("Knight_white").addEventListener("click", promotion);
    document.getElementById("Bishop_white").addEventListener("click", promotion);
    document.getElementById("Queen_white").addEventListener("click", promotion);
    return board;
}
function show_valid_path(event){
    console.log("Showing Valid Path...")
    let piece_pos = parseInt(event.target.id);
    console.log(piece_pos);
    let piece = board[piece_pos];
    if((control == 0 & board[piece_pos] > 55) | (control == 1 & board[piece_pos] < 55)){
        remove_moves();
        if(last_clicked == piece_pos){
            last_clicked = -1;
            return;
        }
        let legal_moves = find_legal(piece_pos);
        console.log(legal_moves);
        for(let move of legal_moves){
            let parent = document.getElementById(move);
            parent.classList.add(piece_pos);
            parent.style.cursor = "pointer";
            if(board[move] == -1 & (piece != 53 & piece != 63)){
                if(parent.classList[0] == "white"){
                    parent.style.borderColor = "#AFEEEE";
                }else{
                    parent.style.borderColor = "#B2FFFF";
                }
            }else if((piece == 53 | piece == 63) & move%8 == piece_pos%8){
                if(parent.classList[0] == "white"){
                    parent.style.borderColor = "#AFEEEE";
                }else{
                    parent.style.borderColor = "#B2FFFF";
                }
            }else{
                if(parent.classList[0] == "white"){
                    parent.style.borderColor = "#F39797";
                }else{
                    parent.style.borderColor = "#F5AEAE";
                }
            }
            parent.addEventListener("click", move_piece);
        }
        last_clicked = piece_pos;
    }
}
function find_legal(piece_pos){
    let piece = board[piece_pos];
    piece_pos = parseInt(piece_pos);
    console.log(piece, piece_pos);
    legal = [];
    if(piece == 40 | piece == 70 | piece == 39 | piece == 69){
        return get_rook_move(piece_pos);
    }else if(piece == 41 | piece == 71){
        return get_horse_move(piece_pos);
    }else if(piece == 42 | piece == 72){
        return get_bishop_move(piece_pos);
    }else if(piece == 43 | piece == 73){
        return get_queen_move(piece_pos);
    }else if(piece == 44 | piece == 74 | piece == 45 | piece == 75){
        return get_king_move(piece_pos);
    }else if(piece > 50){
        return get_pawn_move(piece_pos);
    }
    return legal;
}
function get_horse_move(piece_pos){
    let piece = board[piece_pos];
    let pos = piece_pos % 8;
    let legal = [];
    let moves = [];
        moves.push(piece_pos + 16 + 1);
        moves.push(piece_pos + 16 - 1);
        moves.push(piece_pos - 16 + 1);
        moves.push(piece_pos - 16 - 1);
        moves.push(piece_pos + 2 + 8);
        moves.push(piece_pos + 2 - 8);
        moves.push(piece_pos - 2 + 8);
        moves.push(piece_pos - 2 - 8);
        for(let move of moves){
            if(move > -1 & move < 64 & move % 8 <= pos + 2 & move % 8 >= pos - 2){
                if(board[move] == -1 | (board[move] > 55 & piece < 55) | (board[move] < 55 & piece > 55)){
                    legal.push(move);
                }
            }
        }
        return legal;
}
function get_rook_move(piece_pos){
    let piece = board[piece_pos];
    let legal = [];
    let pos = piece_pos % 8;
    let i = 0;
        for(i = piece_pos + 1; i < piece_pos + 8 - pos; i += 1){
            if(board[i] != -1){
                break;
            }
            legal.push(i);
        }
        if((board[i] > 55 & piece < 55) | (board[i] < 55 & piece > 55)){
            legal.push(i);
        }
        for(i = piece_pos - 1; i > piece_pos - pos - 1; i -= 1){
            if(board[i] != -1){
                break;
            }
            legal.push(i);
        }
        if((board[i] > 55 & piece < 55) | (board[i] < 55 & piece > 55)){
            legal.push(i);
        }
        for(i = piece_pos + 8; i < 56 + pos; i += 8){
            if(board[i] != -1){
                break;
            }
            legal.push(i);
        }
        if((board[i] > 55 & piece < 55) | (board[i] < 55 & piece > 55)){
            legal.push(i);
        } 
        for(i = piece_pos - 8; i > pos; i -= 8){
            if(board[i] != -1){
                break;
            }
            legal.push(i);
        }
        if((board[i] > 55 & piece < 55) | (board[i] < 55 & piece > 55)){
            legal.push(i);
        }
        return legal;    
}
function get_bishop_move(piece_pos){
    let piece = board[piece_pos];
    let legal = [];
    let pos = piece_pos % 8;
    let i = 0;
        for(i = piece_pos + 1 + 8; i%8 > pos; i += 9){
            if(board[i] != -1){
                break;
            }
            legal.push(i);
        }
        if(((board[i] > 55 & piece < 55) | (board[i] < 55 & piece > 55)) & (i%8 > pos)){
            legal.push(i);
        }
        for(i = piece_pos - 1 + 8; i%8 < pos; i += 7){
            if(board[i] != -1){
                break;
            }
            legal.push(i);
        }
        if(((board[i] > 55 & piece < 55) | (board[i] < 55 & piece > 55)) & i%8 < pos){
            legal.push(i);
        }
        for(i = piece_pos + 1 - 8; i%8 > pos; i -= 7){
            if(board[i] != -1){
                break;
            }
            legal.push(i);
        }
        if(((board[i] > 55 & piece < 55) | (board[i] < 55 & piece > 55)) & i%8 > pos){
            legal.push(i);
        }    
        for(i = piece_pos - 1 - 8; i%8 < pos; i -= 9){
            if(board[i] != -1){
                break;
            }
            legal.push(i);
        }
        if(((board[i] > 55 & piece < 55) | (board[i] < 55 & piece > 55)) & i%8 < pos){
            legal.push(i);
        }
        return legal;
}
function get_queen_move(piece_pos){
    let legal = [];
    legal.push(...get_rook_move(piece_pos));
    legal.push(...get_bishop_move(piece_pos));
    return legal;
}
function get_king_move(piece_pos){
    let piece = board[piece_pos];
    let pos = piece_pos % 8;
    let legal = [];
    let moves = [];
    moves.push(piece_pos + 1);
    moves.push(piece_pos - 1);
    moves.push(piece_pos + 8);
    moves.push(piece_pos - 8);
    moves.push(piece_pos + 9);
    moves.push(piece_pos - 9);
    moves.push(piece_pos + 7);
    moves.push(piece_pos - 7);
    for(let move of moves){
        if(move > -1 & move < 64 & ((piece_pos < move & move % 8 >= pos) | (piece_pos > move & move % 8 <= pos))){
            if(board[move] == -1 | (board[move] > 55 & piece < 55) | (board[move] < 55 & piece > 55)){
                    legal.push(move);
            }
        }
    }
    if(piece == 44 | piece == 74){
        if(board[piece_pos + 1] == -1 & board[piece_pos + 2] == -1 & (board[piece_pos + 3] == 39 | board[piece_pos + 3] == 69)){
            legal.push(piece_pos + 2);
        }
        if(board[piece_pos - 1] == -1 & board[piece_pos - 2] == -1 & board[piece_pos - 3] == -1 & (board[piece_pos - 4] == 39 | board[piece_pos - 4] == 69)){
            legal.push(piece_pos - 2);
        }
    }
    return legal;
}
function get_pawn_move(piece_pos){
    let piece = board[piece_pos];
    let legal = [];
    if(piece < 60){
        if(board[piece_pos + 8] == -1){
            legal.push(piece_pos + 8);
        }
        if(board[piece_pos + 7] > 55){
            legal.push(piece_pos + 7);
        }
        if(board[piece_pos + 9] > 55){
            legal.push(piece_pos + 9);
        }
        if(board[piece_pos + 16] == -1 & piece == 51 & board[piece_pos + 8] == -1){
            legal.push(piece_pos + 16);
        }
        if(piece_pos > 31 & piece_pos < 40){
            if(board[piece_pos + 1] == 62){
                legal.push(piece_pos + 9);
            }
            if(board[piece_pos - 1] == 62){
                legal.push(piece_pos + 7);
            }
        }
    }else{
        if(board[piece_pos - 8] == -1){
            legal.push(piece_pos - 8);
        }
        if(board[piece_pos - 7] < 55 & board[piece_pos - 7] > 30){
            legal.push(piece_pos - 7);
        }
        if(board[piece_pos - 9] < 55 & board[piece_pos - 9] > 30){
            legal.push(piece_pos - 9);
        }
        if(board[piece_pos - 16] == -1 & piece == 61 & board[piece_pos - 8] == -1){
            legal.push(piece_pos - 16);
        }
        if(piece_pos > 23 & piece_pos < 32){
            if(board[piece_pos + 1] == 52){
                legal.push(piece_pos - 7);
            }
            if(board[piece_pos - 1] == 52){
                legal.push(piece_pos - 9);
            }
        }
    }
    return legal;
}
function find_rook_type_attack(piece_pos){
    let piece = board[piece_pos];
    let attack = [];
    let pos = piece_pos % 8;
    let i = 0;
        for(i = piece_pos + 1; i < piece_pos + 8 - pos; i += 1){
            if(board[i] != -1 & (piece < 55 & board[i] > 55)){
                attack.push(i);
            }else if(board[i] != -1){
                break;
            }
        }
        for(i = piece_pos - 1; i > piece_pos - pos - 1; i -= 1){
            if(board[i] != -1 & (piece < 55 & board[i] > 55)){
                attack.push(i);
            }else if(board[i] != -1){
                break;
            }
        }
        for(i = piece_pos + 8; i < 56 + pos; i += 8){
            if(board[i] != -1 & (piece < 55 & board[i] > 55)){
                attack.push(i);
            }else if(board[i] != -1){
                break;
            }
        }
        for(i = piece_pos - 8; i > pos; i -= 8){
            if(board[i] != -1 & (piece < 55 & board[i] > 55)){
                attack.push(i);
            }else if(board[i] != -1){
                break;
            }
        }
        return attack;   
}
function find_bishop_type_attack(piece_pos){
    let piece = board[piece_pos];
    let attack = [];
    let pos = piece_pos % 8;
    let i = 0;
        for(i = piece_pos + 1 + 8; i%8 > pos; i += 9){
            if(board[i] != -1 & (piece < 55 & board[i] > 55)){
                attack.push(i);
            }else if(board[i] != -1){
                break;
            }
        }
        for(i = piece_pos - 1 + 8; i%8 < pos; i += 7){
            if(board[i] != -1 & (piece < 55 & board[i] > 55)){
                attack.push(i);
            }else if(board[i] != -1){
                break;
            }
        }
        for(i = piece_pos + 1 - 8; i%8 > pos; i -= 7){
            if(board[i] != -1 & (piece < 55 & board[i] > 55)){
                attack.push(i);
            }else if(board[i] != -1){
                break;
            }
        }
        for(i = piece_pos - 1 - 8; i%8 < pos; i -= 9){
            if(board[i] != -1 & (piece < 55 & board[i] > 55)){
                attack.push(i);
            }else if(board[i] != -1){
                break;
            }
        }
        return legal;
}
function check(piece_pos){
    attack = [...find_rook_type_attack(piece_pos)];
}
function promotion(event){
    let element = event.target;
    let popup = element.classList[0];
    console.log(element.classList);
    popup = document.getElementById(popup);
    console.log(popup.classList);
    let position = parseInt(popup.classList[1]);
    popup.classList.remove(position);
    let value = element.innerHTML;
    element = parseInt(element.classList[1]);
    board[position] = element;
    element = document.getElementById(position);
    element.innerHTML = element.innerHTML.replace(element.innerHTML[0], value);
    popup.style.visibility = "hidden"
    popup.style.opacity = "0";
}
function move_piece(event){
    let element = event.target;
    let position = parseInt(element.id);
    let piece_pos = element.classList;
    piece_pos = parseInt(piece_pos[piece_pos.length - 1]);
    let legal_moves = find_legal(piece_pos);
    for(let move of legal_moves){
        let parent = document.getElementById(move);
        parent.removeEventListener("click", move_piece);
        parent.classList.remove(piece_pos);
        if(board[move] == -1 | move == position){
            parent.style.cursor = "default";
        }
        if(parent.classList[0] == "white"){
            parent.style.borderColor = "#fff";
        }else{
            parent.style.borderColor = "#999";
        }
    }
    console.log("Past Loop");
    let piece = board[piece_pos];
    first_move = [51, 61, 52, 62, 39, 69, 44, 74]
    for(let pi of first_move){
        if (piece == pi){
            board[piece_pos] += 1;
            break;
        }
    }
    if(piece == 53 | piece == 63){
        if((position == piece_pos + 7 & board[piece_pos - 1] == 62) | (position == piece_pos - 9 & board[piece_pos - 1] == 52)){
            board[position] = board[piece_pos - 1];
            board[piece_pos - 1] = -1;
            piece = document.getElementById(piece_pos - 1);
            element = document.getElementById(position);
            element.innerHTML = piece.innerHTML[0] + element.innerHTML;
            piece.innerHTML = piece.innerHTML.replace(piece.innerHTML[0],"");
        }else if((position == piece_pos + 9 & board[piece_pos + 1] == 62) | (position == piece_pos - 7 & board[piece_pos + 1] == 52)){
            board[position] = board[piece_pos + 1];
            board[piece_pos + 1] = -1;
            piece = document.getElementById(piece_pos + 1);
            element = document.getElementById(position);
            element.innerHTML = piece.innerHTML[0] + element.innerHTML;
            piece.innerHTML = piece.innerHTML.replace(piece.innerHTML[0],"");
        }
    }
    if(board[position] != -1){
        let value = document.getElementById(position).innerHTML[0];
        let child1 = document.createElement("div");
        let grave = "parent";
        child1.innerHTML = value;
        child1.classList.add("death_value");
        let child2 = document.createElement("sub");
        child2.classList.add("death_count");
        child2.id = "death_count";
        child2.innerHTML = "x1";
        child2.style.color = "#999";
        if(board[position] > 55){
            grave = document.getElementById("white_grave");
        }else{
            grave = document.getElementById("black_grave");
        }
        child1.appendChild(child2);
        grave.appendChild(child1);
    }
    piece = document.getElementById(piece_pos);
    element = document.getElementById(position);
    if(board[position] != -1){
        element.innerHTML = element.innerHTML.replace(element.innerHTML[0], piece.innerHTML[0]);
    }else{
        element.innerHTML = piece.innerHTML[0] + element.innerHTML;
    }
    element.style.cursor = "pointer";
    element.addEventListener("click", show_valid_path);
    piece.innerHTML = piece.innerHTML.replace(piece.innerHTML[0], '');
    piece.removeEventListener("click", show_valid_path);
    piece.style.cursor = "default";
    board[position] = board[piece_pos];
    board[piece_pos] = -1;
    if(Math.abs(piece_pos - position) > 1 & (board[position] == 45 | board[position] == 75)){
        if(piece_pos < position){
            board[position - 1] = board[piece_pos + 3] + 1;
            board[piece_pos + 3] = -1;
            piece = document.getElementById(piece_pos+3);
            element = document.getElementById(position-1);
            console.log(piece_pos + 3);
            console.log(position - 1);
        }else{
            board[position + 1] = board[piece_pos - 4] + 1;
            board[piece_pos - 4] = -1;
            piece = document.getElementById(piece_pos-4);
            element = document.getElementById(position+1);
            console.log(piece_pos - 4);
            console.log(position + 1);
        }
        element.style.cursor = "pointer";
        element.addEventListener("click", show_valid_path);
        element.innerHTML = piece.innerHTML[0] + element.innerHTML;
        piece.innerHTML = piece.innerHTML.replace(piece.innerHTML[0], '');
        piece.removeEventListener("click", show_valid_path);
        piece.style.cursor = "default";
    }
    control = 1 - control;
    let turn = control ? "Black Plays" : "White Plays";
    document.getElementById("turn").innerHTML = turn;
    if(board[position] == 53 | board[position] == 63){
        let popup = ""
        let flag = false;
        if(position > 55 & board[position] == 53){
            flag = true;
            popup = document.getElementById("black_pop");
        }else if(position < 8 & board[position] == 63){
            flag = true;
            popup = document.getElementById("white_pop");
        }
        if(flag){
            popup.style.visibility = "visible";
            popup.style.opacity = 1;
            popup.classList.add(position);
        }
    }
}
function remove_moves(){
    for(let i = 0; i < 64; i += 1){
        let parent = document.getElementById(i);
        if(parent.classList.length == 2){
            let class_list = parent.classList;
            let piece_pos = class_list[class_list.length - 1]
            parent.classList.remove(piece_pos);
            parent.removeEventListener("click", move_piece);
            parent.style.cursor = "default";
            if(class_list[0] == "white"){
                parent.style.borderColor = "#fff";
            }else{
                parent.style.borderColor = "#999";
            }
        }
    }
}
let piece_info = { 39: "Black Rook", 40: "Black Rook", 41: "Black_Horse", 42: "Black_Bishop", 43: "Black_Queen", 44: "Black_King", 45: "Black_King", 51: "Black_Pawn", 52: "Black_Pawn", 53: "Black_Pawn",
69: "White_Rook", 70: "White_Rook", 71: "White_Horse", 72: "White_Bishop", 73: "White_Queen", 74: "White_King", 75: "White_King", 61: "White_Pawn", 62: "White_Pawn", 63:"White_Pawn"};
let board = restart();
control = 0;
document.getElementById("turn").innerHTML = "White Plays";
last_clicked = -1;
console.log(board);