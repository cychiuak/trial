const Heart = function(ctx, x, y) {
	
	//This is the sprite sequences of the fire.
	const sequence = { x:0 , y:0 , width:32 , height:32 , count:4 , timing:200 , loop:true };
	
	const sprite = Sprite(ctx, x, y);
	
	sprite.setSequence(sequence)
		  .setScale(1.5)
		  .setShadowScale({ x:0.75, y:0.2})
		  .useSheet("heart_sprite.png");
		  
	return{
		draw: sprite.draw,
		update: sprite.update
	};
};