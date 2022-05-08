const gameUI = function(){
    const initialize = function(){
        document.getElementById('game-content').style.display = "none";
    }
    const show = function(){
        document.getElementById('game-content').style.display = "inline";
        document.getElementById('button').style.dislay = "none";
    }
    return{initialize,show};

}