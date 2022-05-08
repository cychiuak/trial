const boundingbox = function(x,y,width,height){
    const points = {top:y,right:x+width,bottom :y+height,left:x+width};
    const gettop = function(){
        return points.top;
    }
    const getright = function(){
        return points.right;
    }
    const getleft = function(){
        return points.left;
    }
    const getbottom = function(){
        return points.bottom;
    }
    return{
        gettop:gettop,
        getright:getright,
        getbottom:getbottom,
        getleft:getleft
    };
}