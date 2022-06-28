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
  mouse: IMouseModel = {
    isPressed: false,
    down: null,
    current: null,
    up: null,
  };

  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  lines: Array<ILineModel> = [];
  isKeyPressed = false;

  async getCanvas() {
    this.canvas = await document.querySelector("canvas");
    if (this.canvas) {
      this.canvas.width = 500;
      this.canvas.height = 500;
      this.ctx = this.canvas.getContext("2d");
    }
    return {
      canvas: this.canvas,
      ctx: this.ctx
    };
  }

  async loadCanvasImage(url: string) {
    if (this.canvas && this.ctx) {
      const img = new Image();
      console.log(url);

      img.src = 'https://pbs.twimg.com/profile_images/1455185376876826625/s1AjSxph_400x400.jpg';
      img.onload = () => {
        this.ctx!.drawImage(img, 0, 0)
      };
      console.log(img);
      this.ctx.save();
    }
  }

  draw() {
    this.clearCanvas();
    this.lines.forEach(line => {
      this.drawLine(line);
    });
  }

  drawLine(line: any) {
    const {
      start,
      end,
      lineWidth = 5,
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

  setDown(event: Event, element: HTMLCanvasElement) {
    this.mouse.isPressed = true;
    this.mouse.down = this.getPosition(event, element);
    this.isKeyPressed = true;
  }

  setUp(event: any, element: HTMLCanvasElement) {
    this.mouse.isPressed = false;
    // this.mouse.up = this.getPosition(event, element);
    this.mouse.up!.x = event.clientX;
    this.mouse.up!.x = event.clientX;
  }

  setCurrent(event: Event, element: HTMLCanvasElement) {
    this.mouse.current = this.getPosition(event, element);
  }

  getPosition(event: any, element: HTMLCanvasElement) {
    const position = {
      x: event.clientX - element.offsetLeft,
      y: event.clientY - element.offsetTop,
    };
    return position;
  }

  clearCanvas() {
    if (this.canvas && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.restore();
    }
  }

  handleMouseDown(e: Event) {
    if (this.canvas) {
      this.setDown(e, this.canvas);
    }

    if (this.mouse.down && this.mouse.current) {
      const line: ILineModel = {
        start: this.mouse.down,
        end: this.mouse.down,
      };
      this.lines.push(line);
      this.draw();
    }
  }

  handleMouseUp(e: Event) {
    if (this.canvas) {
      this.setUp(e, this.canvas);
    }
  }

  handleMouseMove(e: Event) {
    console.log(this.lines);

    if (this.mouse.isPressed) {
      if (this.canvas) {
        this.setCurrent(e, this.canvas);
      }
      if (this.mouse.down && this.mouse.current && !this.isKeyPressed) {
        const line: ILineModel = {
          start: this.mouse.down,
          end: this.mouse.current,
        };
        this.lines.pop();
        this.lines.push(line);
        this.draw();
      } else if (this.mouse.down && this.mouse.current && this.isKeyPressed && this.lines.length > 0) {
        const line: ILineModel = {
          start: this.mouse.down,
          end: this.lines[0].start,
        };
        this.lines.pop();
        this.lines.push(line);
        this.draw();
      }
    }
  }
}
