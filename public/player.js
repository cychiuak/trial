//ctx for canvas
//x is x-coordinate
//y is y-coordinate
//gamearea
const Player = function(ctx,x,y,gamearea){
    let player_width = 50;
    let player_height = 50;
    let speed = 700;
    let image = new Image();
    let positionx = x;
    let positiony = y;
    image.src = "rocket.png";
    //image.id = "rocket";
    let bounding_box = boundingbox(x,y,player_width,player_height);
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
            
            
    }
}
    const draw = function(){
        //ctx.save();
        ctx.clearRect(positionx, positiony,player_width,player_height);
        ctx.drawImage(
            image,
            positionx,
            positiony,
            player_width,player_height
        );
        //ctx.restore();
    }
    const setImage = function(src){
        image.src = src;
    }
    const getY = function(){
        return positiony;
    }
    const getX = function(){
        return positionx;
    }
    const setX = function(x){
        positionx = x;
        return positionx;
    }
    const setY = function(y){
        positiony = y;
        return positiony;
    }
    const gettop = function(){
        return positiony;
    }
    const getright = function(){
        return positionx+player_width;
    }
    const getleft = function(){
        return positionx;
    }
    const getbottom = function(){
        return positiony+player_height;
    }
    /* Update the sprite object */
    return{
        move:move,
        draw:draw,
        setImage:setImage,
        getY:getY,
        getX:getX,
        setspeed:setspeed,
        gettop:gettop,
        getright:getright,
        getleft:getleft,
        getbottom:getbottom,
        setX:setX,
        setY:setY

    };
}