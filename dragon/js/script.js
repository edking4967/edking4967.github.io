const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
let lastTimestamp = null;

class Dragon {
    asset;
    ctx;
    size = { w: undefined, h: undefined };
    pos = { x: 200, y: 50 };
    vel = { x: 150, y: 150 };
    constructor(url, initialPos, xOffset, ctx) {
        this.asset = new Image();
        this.asset.src = url;
        this.ctx = ctx;
        this.initialPos = initialPos;
        this.xOffset = xOffset;
    }
    async preload() {
        await this.asset.decode();
        if (this.size.w === undefined) {
            this.size.w = this.asset.width;
            this.size.h = this.asset.height;
        }
    }
    draw() {
        this.ctx.drawImage(
            this.asset,
            this.pos.x - this.size.w / 2,
            this.pos.y - this.size.h / 2
        );
    }

    moveSin(timestamp) {
        this.pos.x = this.initialPos.x + Math.sin(timestamp / 400 + this.xOffset) * 40;
        this.pos.y = this.initialPos.y;
    }
}

const dragon = new Dragon("img/dragon.png", { x: 200, y: 50}, 0, ctx);

const cube1 = new Dragon("img/cube.png", { x: 200, y: 160 }, 100, ctx);

const cube2 = new Dragon("img/cube.png", { x: 200, y: 260 }, 200, ctx);

Promise.all([dragon, cube1, cube2].map((obj) => obj.preload())).then(() =>
    requestAnimationFrame(update)
);

function update(timestamp) {
    const dt = lastTimestamp === null ? 0 : (timestamp - lastTimestamp) / 1000; // ?
    lastTimestamp = timestamp;

    dragon.moveSin(timestamp);
    cube1.moveSin(timestamp);
    cube2.moveSin(timestamp);

    ctx.fillStyle = "#4c0655";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    dragon.draw();
    cube1.draw();
    cube2.draw();

    requestAnimationFrame(update);
}
