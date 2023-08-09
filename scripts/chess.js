function restart() {
    let board = Array(64).fill(-1);
    let black_pieces = [39, 41, 42, 43, 44, 42, 41, 39, 51];
    let white_pieces = [69, 71, 72, 73, 74, 72, 71, 69, 61];
    let black_text = ["&#9820;","&#9822;","&#9821;","&#9819;","&#9818;","&#9821;","&#9822;", "&#9820;","&#9823;"];
    let white_text = ["&#9814;","&#9816;","&#9815;","&#9813;","&#9812;","&#9815;","&#9816;", "&#9814;", "&#9817;"];
    control = 0;
    king_pos = [4, 60];
    document.getElementById("turn").innerHTML = "White Plays";
    last_clicked = -1;
    document.getElementById("white_grave").innerHTML = "";
    document.getElementById("black_grave").innerHTML = "";
    document.getElementById("checkmate").innerHTML = "";
    for(let i = 0; i < 48; i += 1){
        if(i < 16){
            let black = document.getElementById(i);
            let white = document.getElementById(i+48);
            let text1 = black.innerHTML;
            let text2 = white.innerHTML;
            if(i < 8){
                board[i] = black_pieces[i];
                board[i+56] = white_pieces[i];
                if(text1.length > 0 & text1[0] != "<"){
                    black.innerHTML = black.innerHTML.replace(text1[0], black_text[i]);
                }else{
                    black.innerHTML = black_text[i] + black.innerHTML;
                }
                if(text2.length > 0 & text2[0] != "<"){
                    white.innerHTML = white.innerHTML.replace(text2[0], white_text[8]);
                }else{
                    white.innerHTML = white_text[8] + white.innerHTML;
                }
            }else{
                board[i] = black_pieces[8];
                board[i+40] = white_pieces[8];
                if(text1.length > 0 & text1[0] != "<"){
                    black.innerHTML = black.innerHTML.replace(text1[0], black_text[8]);
                }else{
                    black.innerHTML = black_text[8] + black.innerHTML;
                }
                if(text2.length > 0 & text2[0] != "<"){
                    white.innerHTML = white.innerHTML.replace(text2[0], white_text[i-8]);
                }else{
                    white.innerHTML = white_text[i-8] + white.innerHTML;
                }
            }
            black.style.cursor = "pointer";
            white.style.cursor = "pointer";
            black.addEventListener("click", show_valid_path);
            white.addEventListener("click", show_valid_path);
        }else{
            let parent = document.getElementById(i);
            let text = parent.innerHTML;
            if(text.length > 0 & text[0] != "<"){
                parent.innerHTML = parent.innerHTML.replace(text[0], "");
            }
            parent.style.cursor = "default";
        }
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
    piece_pos = parseInt(piece_pos);
    let piece = board[piece_pos];
    console.log(piece, piece_pos);
    let king = 0;
    let legal = [];
    let final = [];
    let result = [];
    let attack = [];
    if(piece == 40 | piece == 70 | piece == 39 | piece == 69){
        legal =  get_rook_move(piece_pos);
    }else if(piece == 41 | piece == 71){
        legal = get_horse_move(piece_pos);
    }else if(piece == 42 | piece == 72){
        legal = get_bishop_move(piece_pos);
    }else if(piece == 43 | piece == 73){
        legal = get_queen_move(piece_pos);
    }else if(piece == 44 | piece == 74 | piece == 45 | piece == 75){
        legal = get_king_move(piece_pos);
    }else if(piece > 50){
        legal = get_pawn_move(piece_pos);
    }
    for(move of legal){
        if(board[move] != 44 & board[move]!= 45 &board[move] != 74 & board[move] != 75){
            final.push(move);
        }
    }
    legal = [...final];
    if(piece > 55){
        king = king_pos[1];
    }
    else{
        king = king_pos[0];
    }
    result = check(king, board[king]);
    attack = result[1];
    result = result[0];
    final = [];
    if(piece != 44 & piece != 45 & piece != 74 & piece != 75 & attack.length == 1){
        result.push(...attack);
        for(let i of result){
            for(let j of legal){
                if(i == j){
                    final.push(j);
                }
            }
        }
    }else {
        for(let i of legal){
            let temp = board[i];
            board[i] = piece;
            board[piece_pos] = -1;
            if(piece == 74 | piece == 75 | piece == 44 | piece == 45){
                result = check(i, board[i])
            }else{
                result = check(king, board[king]);
            }
            if(result[0].length + result[1].length == 0){
                final.push(i);
            }
            board[piece_pos] = piece;
            board[i] = temp;
        }
    }
    return final;
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
            for(i = piece_pos + 1; i%8 > pos; i += 1){
                if(board[i] != -1){
                    break;
                }
                legal.push(i);
            }
            if(((board[i] > 55 & piece < 55) | (board[i] < 55 & piece > 55 & board[i] > -1)) & i%8 > pos){
                legal.push(i);
            }
            for(i = piece_pos - 1; i%8 < pos; i -= 1){
                if(board[i] != -1){
                    break;
                }
                legal.push(i);
            }
            if((board[i] > 55 & piece < 55) | (board[i] < 55 & piece > 55 & board[i] > -1)){
                legal.push(i);
            }
            for(i = piece_pos + 8; i%8 == pos & i < 64; i += 8){
                if(board[i] != -1){
                    break;
                }
                legal.push(i);
            }
            if((board[i] > 55 & piece < 55) | (board[i] < 55 & piece > 55 & board[i] > -1)){
                legal.push(i);
            } 
            for(i = piece_pos - 8; i%8 == pos & i > -1; i -= 8){
                if(board[i] != -1){
                    break;
                }
                legal.push(i);
            }
            if((board[i] > 55 & piece < 55) | (board[i] < 55 & piece > 55 & board[i] > -1)){
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
        if(((board[i] > 55 & piece < 55) | (board[i] < 55 & piece > 55 & board[i] > -1)) & (i%8 > pos)){
            legal.push(i);
        }
        for(i = piece_pos - 1 + 8; i%8 < pos; i += 7){
            if(board[i] != -1){
                break;
            }
            legal.push(i);
        }
        if(((board[i] > 55 & piece < 55) | (board[i] < 55 & piece > 55 & board[i] > -1)) & i%8 < pos){
            legal.push(i);
        }
        for(i = piece_pos + 1 - 8; i%8 > pos; i -= 7){
            if(board[i] != -1){
                break;
            }
            legal.push(i);
        }
        if(((board[i] > 55 & piece < 55) | (board[i] < 55 & piece > 55 & board[i] > -1)) & i%8 > pos){
            legal.push(i);
        }    
        for(i = piece_pos - 1 - 8; i%8 < pos; i -= 9){
            if(board[i] != -1){
                break;
            }
            legal.push(i);
        }
        if(((board[i] > 55 & piece < 55) | (board[i] < 55 & piece > 55 & board[i] > -1)) & i%8 < pos){
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
            if(board[move] == -1 | (board[move] > 55 & piece < 55) | (board[move] < 55 & piece > 55 & board[move] > -1)){
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
    let pos = piece_pos%8;
    if(piece < 60){
        if(board[piece_pos + 8] == -1){
            legal.push(piece_pos + 8);
        }
        if(board[piece_pos + 7] > 55 & (piece_pos + 7)%8 < pos){
            legal.push(piece_pos + 7);
        }
        if(board[piece_pos + 9] > 55 & (piece_pos + 9)%8 > pos){
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
        if(board[piece_pos - 7] < 55 & board[piece_pos - 7] > 30 & (piece_pos - 7)%8 > pos){
            legal.push(piece_pos - 7);
        }
        if(board[piece_pos - 9] < 55 & board[piece_pos - 9] > 30 & (piece_pos - 9)%8 < pos){
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
function find_rook_type_attack(piece_pos, piece){
    let pos = piece_pos%8;
    let result = [];
    let final = [];
    let attack = [];
    let bad = 0;
    let i = 0;
    for(i = piece_pos + 1; i%8 > pos; i += 1){
        if(board[i] != -1){
            bad = board[i];
            if((piece < 55 & (bad == 69 | bad == 70 | bad == 73)) | (piece > 55 & (bad == 39 | bad == 40 | bad == 43))){
                final.push(...result);
                attack.push(i);
            }
            result = [];
            break;
        }
        result.push(i);
    }
    for(i = piece_pos - 1; i%8 < pos; i -= 1){
        if(board[i] != -1){
            bad = board[i];
            if((piece < 55 & (bad == 69 | bad == 70 | bad == 73)) | (piece > 55 & (bad == 39 | bad == 40 | bad == 43))){
                final.push(...result);
                attack.push(i);
            }
            result = [];
            break;
        }
        result.push(i);
    }
    for(i = piece_pos + 8; i%8 == pos & i < 64; i += 8){
        if(board[i] != -1){
            bad = board[i];
            if((piece < 55 & (bad == 69 | bad == 70 | bad == 73)) | (piece > 55 & (bad == 39 | bad == 40 | bad == 43))){
                final.push(...result);
                attack.push(i);
            }
            result = [];
            break;
        }
        result.push(i);
    }
    for(i = piece_pos - 8; i%8 == pos & i > -1; i -= 8){
        if(board[i] != -1){
            bad = board[i];
            if((piece < 55 & (bad == 69 | bad == 70 | bad == 73)) | (piece > 55 & (bad == 39 | bad == 40 | bad == 43))){
                final.push(...result);
                attack.push(i);
            }
            break;
        }
        result.push(i);
    }
    return [final, attack];
}
function find_bishop_type_attack(piece_pos, piece){
    let pos = piece_pos%8;
    let result = [];
    let final = [];
    let attack = [];
    let bad = 0;
    let i = 0;
    for(i = piece_pos - 9; i%8 < pos & i > -1; i -= 9){
        if(board[i] != -1){
            bad = board[i];
            if((piece < 55 & (bad == 72 | bad == 73)) | (piece > 55 & (bad == 42 | bad == 43))){
                final.push(...result);
                attack.push(i);
            }
            result = [];
            break;
        }
        result.push(i);
    }
    for(i = piece_pos - 7; i%8 > pos & i > -1; i -= 7){
        if(board[i] != -1){
            bad = board[i];
            if((piece < 55 & (bad == 72 | bad == 73)) | (piece > 55 & (bad == 42 | bad == 43))){
                final.push(...result);
                attack.push(i);
            }
            result = [];
            break;
        }
        result.push(i);
    }
    for(i = piece_pos+ 7; i%8 < pos & i < 64; i += 7){
        if(board[i] != -1){
            bad = board[i];
            if((piece < 55 & (bad == 72 | bad == 73)) | (piece > 55 & (bad == 42 | bad == 43))){
                final.push(...result);
                attack.push(i);
            }
            result = [];
            break;
        }
        result.push(i);
    }
    for(i = piece_pos + 9; i%8 > pos & i < 64; i += 9){
        if(board[i] != -1){
            bad = board[i];
            if((piece < 55 & (bad == 72 | bad == 73)) | (piece > 55 & (bad == 42 | bad == 43))){
                final.push(...result);
                attack.push(i);
            }
            break;
        }
        result.push(i);
    }
    return [final, attack];
}
function find_pawn_type_attack(piece_pos, piece){
    let final = [];
    let attack = [];
    let bad = 0;
    if(piece > 55){
        bad = board[piece_pos - 7];
        if(bad == 51 | bad == 52 | bad == 53 | bad == 42 | bad == 43){
            attack.push(piece_pos - 7);
        }
        bad = board[piece_pos - 9];
        if(bad == 51 | bad == 52 | bad == 53 | bad == 42 | bad == 43){
            attack.push(piece_pos - 9);
        }
    }else{
        bad = board[piece_pos + 7];
        if(bad == 61 | bad == 62 | bad == 63 | bad == 72 | bad == 73){
            attack.push(piece_pos + 7);
        }
        bad = board[piece_pos + 9];
        if(bad == 61 | bad == 62 | bad == 63 | bad == 72 | bad == 73){
            attack.push(piece_pos + 9);
        }
    }
    return [final, attack];
}
function find_horse_type_attack(piece_pos, piece){
    let moves = [];
    let final = [];
    let attack = [];
    moves.push(piece_pos + 16 + 1);
    moves.push(piece_pos + 16 - 1);
    moves.push(piece_pos - 16 + 1);
    moves.push(piece_pos - 16 - 1);
    moves.push(piece_pos + 2 + 8);
    moves.push(piece_pos + 2 - 8);
    moves.push(piece_pos - 2 + 8);
    moves.push(piece_pos - 2 - 8);
    for(let move of moves){
        if(board[move] != -1){
            if((piece > 55 & board[move] == 41) | (piece < 55 & board[move] == 71)){
                attack.push(move);
            }
        }
    }
    return [final, attack];
}
function check(piece_pos, piece){
    let result = [];
    let attack = [];
    let temp = find_pawn_type_attack(piece_pos, piece);
    result.push(...temp[0]);
    attack.push(...temp[1]);
    temp = find_horse_type_attack(piece_pos, piece);
    for(let i of temp[0]){
        let flag = true;
        for(let j of result){
            if(j == i){
                flag = false;
            }
        }
        if(flag){
            result.push(i);
        }
    }
    for(let i of temp[1]){
        let flag = true;
        for(let j of result){
            if(j == i){
                flag = false;
            }
        }
        if(flag){
            attack.push(i);
        }
    }
    temp = find_bishop_type_attack(piece_pos, piece);
    for(let i of temp[0]){
        let flag = true;
        for(let j of result){
            if(j == i){
                flag = false;
            }
        }
        if(flag){
            result.push(i);
        }
    }
    for(let i of temp[1]){
        let flag = true;
        for(let j of result){
            if(j == i){
                flag = false;
            }
        }
        if(flag){
            attack.push(i);
        }
    }
    temp = find_rook_type_attack(piece_pos, piece);
    for(let i of temp[0]){
        let flag = true;
        for(let j of result){
            if(j == i){
                flag = false;
            }
        }
        if(flag){
            result.push(i);
        }
    }
    for(let i of temp[1]){
        let flag = true;
        for(let j of result){
            if(j == i){
                flag = false;
            }
        }
        if(flag){
            attack.push(i);
        }
    }
    return [result, attack];
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
    console.log("Before Loop");
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
        let trial = document.getElementById(value);
        if(trial == null){
            let child1 = document.createElement("div");
            let grave = "parent";
            child1.innerHTML = value;
            child1.classList.add("death_value");
            child1.id = value;
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
        }else{
            let child2 = trial.lastChild;
            let death_count = parseInt(child2.innerHTML[1]);
            death_count += 1;
            child2.innerHTML = "x" + death_count;
        }
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
    if(Math.abs(piece_pos%8 - position%8) > 1 & (board[position] == 45 | board[position] == 75)){
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
    if(board[position] == 45){
        king_pos[0] = position;
    }else if(board[position] == 75){
        king_pos[1] = position;
    }
    if(board[position] > 55){
        let legal = find_legal(king_pos[0]);
        if(legal.length == 0){
            let result = check(king_pos[0], board[king_pos[0]]);
            let flag = true;
            for(let i = 0; i < 64; i += 1){
                if(board[i] < 55 & i != 45 & i != 44){
                    legal = find_legal(i);
                    if(legal.length > 0){
                        flag = false;
                        break;
                    }
                }
            }
            if(flag & result[1].length > 0){
                document.getElementById("checkmate").innerHTML = "White Won by checkmate";
                console.log("White won by checkmate");
                remove_listners();
            }else if(flag & result[1].length == 0){
                document.getElementById("checkmate").innerHTML = "Stalemate :(";
                console.log("Stalemate, unfortunate");
                remove_listners();
            }
        }
    }else{
        let legal = find_legal(king_pos[1]);
        if(legal.length == 0){
            let result = check(king_pos[1], board[king_pos[1]]);
            let flag = true;
            for(let i = 0; i < 64; i += 1){
                if(board[i] > 55 & i != 75 & i != 74){
                    legal = find_legal(i);
                    if(legal.length > 0){
                        flag = false;
                        break;
                    }
                }
            }
            if(flag & result[1].length > 0){
                document.getElementById("checkmate").innerHTML = "Black Won by checkmate";
                console.log("Black won by checkmate");
                remove_listners();
            }else if(flag & result[1].length == 0){
                document.getElementById("checkmate").innerHTML = "Stalemate :(";
                console.log("Stalemate, unfortunate");
                remove_listners();
            }
        }
    }
    control = 1 - control;
    let turn = control ? "Black Plays" : "White Plays";
    document.getElementById("turn").innerHTML = turn;
}
function remove_listners(){
    for(let i = 0; i < 64; i += 1){
        if(board[i] > -1){
            let parent = document.getElementById(i);
            parent.removeEventListener("click", show_valid_path);
            parent.style.cursor = "default";
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
            if(board[i] == -1){
                parent.style.cursor = "default";
            }
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

let king_pos = [4, 60];
control = 0;
document.getElementById("turn").innerHTML = "White Plays";
last_clicked = -1;
let board = restart();
console.log(board);
