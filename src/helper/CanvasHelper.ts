interface IPositionModel {
  x: number;
  y: number;
}

interface ILineModel {
  start: IPositionModel;
  end: IPositionModel;
}

interface IMouseModel {
  isPressed: boolean;
  down: IPositionModel | null;
  current: IPositionModel | null;
  up: IPositionModel | null;
}

export class CanvasHelper {
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  mouse: IMouseModel = {
    isPressed: false,
    down: null,
    current: null,
    up: null,
  };
  lines: ILineModel[] = [];

  async init() {
    this.canvas = await document.querySelector("canvas");
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.ctx = this.canvas.getContext("2d");
    }
  }

  drawLine(line: any) {
    const {
      start,
      end,
      lineWidth = 20,
      lineCap = "round",
      strokeStyle = "white",
    } = line;

    if (!start || !end) {
      throw new Error("Start or end of line not defined.");
    }

    if (this.canvas && this.ctx) {
      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.lineTo(end.x, end.y);
      this.ctx.lineWidth = lineWidth;
      this.ctx.lineCap = lineCap;
      this.ctx.strokeStyle = strokeStyle;
      this.ctx.stroke();
    }
  }

  getPosition(event: any) {
    return {
      x: event.clientX - this.canvas!.offsetLeft,
      y: event.clientY - this.canvas!.offsetTop,
    };
  }

  setDown(event: KeyboardEvent) {
    this.mouse.isPressed = true;
    this.mouse.down = this.getPosition(event);
  }

  setUp(event: any) {
    this.mouse.isPressed = false;
    this.mouse.up = this.getPosition(event);
  }

  setCurrent(event: any) {
    this.mouse.current = this.getPosition(event);
  }

  draw() {
    if (this.canvas && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.lines.forEach((line) => {
        this.drawLine(line);
      });
    }
  }

  connectLines() {
    if (this.lines.length === 0) {
      return;
    }
    const lastLine = this.lines[this.lines.length - 1];
    const firstLine = this.lines[0];
    const line = {
      start: lastLine!.end,
      end: firstLine!.start,
    };
    this.lines.push(line);
    this.draw();
  }

  async handleMouseDown(e: any) {
    await this.setDown(e);
    console.log("hello woels");

    if (this.mouse.down) {
      const line = {
        start: this.mouse.down,
        end: this.mouse.down,
      };
      this.lines.push(line);
      this.draw();
    }
  }

  handleMouseUp(e: any) {
    this.setUp(e);
  }

  handleMouseMove(e: any) {
    if (this.mouse.isPressed) {
      this.setCurrent(e);
      if (this.mouse.down && this.mouse.current) {
        const line = {
          start: this.mouse.down,
          end: this.mouse.current,
        };
        this.lines.pop();
        this.lines.push(line);
        this.draw();
      }
    }
  }

  //   drawPolygon(e: any) {
  //     if (this.lines.length === 0) {
  //       this.setDown(e);
  //     }
  //     if (this.mouse.down) {
  //       const startLine =
  //         this.lines[this.lines.length - 1] &&
  //         this.lines[this.lines.length - 1].end
  //           ? this.lines[this.lines.length - 1].end
  //           : this.mouse.down;
  //       const line = {
  //         start: startLine,
  //         end: this.mouse.down,
  //       };

  //       this.lines.push(line);
  //       this.draw();
  //     }
  //   }

  drawPolygonWithFill(color: string = "#fff"): void {
    if (this.ctx) {
      this.ctx.save();
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.moveTo(this.lines[0].start.x, this.lines[0].start.y);
      for (let i = 1; i < this.lines.length; i++) {
        this.ctx.lineTo(this.lines[i].x, this.lines[i].y);
      }
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}
