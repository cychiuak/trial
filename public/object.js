const object = function(ctx,x,y,width,height){
    let image = new Image();
    let positionx = x;
    let positiony = y;
    let objectwidth = width;
    let objectheight = height;
    let speed = 60;
    let gamestarttime = 0;
    const setspeed = function(thespeed){
        speed = thespeed;
    }
    const move = function(dir){
        if (dir != 0) {
            

            /* Move the player */
            switch (dir) {
                case 1: positionx -= speed / 60; break;
                case 2: positiony -= speed / 60; break;
                case 3: positionx += speed / 60; break;
                case 4: positiony += speed / 60; break;
            }
            
            draw(positionx, positiony);
    }
}

    
    const draw = function(x,y){
        //ctx.save();
        ctx.clearRect(x-10, y-10,objectwidth+15,objectheight+15);
        ctx.drawImage(
            image,
            x,
            y,
            objectwidth,objectheight
        );
        //ctx.restore();
    }
    const setImage = function(src){
        image.src = src;
    }


    return {draw,move,setImage,setspeed};
}