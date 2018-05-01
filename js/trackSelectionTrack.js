class TrackSelectionTrack {
    constructor(map, x) {
        this.map = map;
        this.x = x;
    }

    draw(ctx, viewX)
    {
        ctx.save();
        ctx.shadowColor = "#191919";
        ctx.shadowBlur = 70;
        ctx.drawImage(this.map.imgSelect, this.x - viewX - this.map.imgSelect.width/2, 360 - this.map.imgSelect.height/2);
        ctx.restore();
    }
}
