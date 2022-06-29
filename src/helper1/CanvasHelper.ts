interface IPositionModel {
  x: number;
  y: number;
}

// interface ILineModel {
//   start: IPositionModel;
//   end: IPositionModel;
// }

export class CanvasHelper {
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  polygonList: Array<IPositionModel[]> = [];
  polygon: Array<IPositionModel> = [];
  isPressed = false;
  init() {
    this.canvas = document.querySelector("canvas");
    if (this.canvas) {
      this.canvas.width = 800;
      this.canvas.height = 800;
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

  setDown(e: MouseEvent) {
    return {
      x: e.clientX - this.canvas!.offsetLeft,
      y: e.clientY - this.canvas!.offsetTop,
    };
  }

  async trackPoints(event: MouseEvent) {
    const line = {
      x: event.clientX,
      y: event.clientY,
    };

    if (this.polygon.length > 0 && this.polygon[0].x === line.x) {
      console.log("Draw Polygon");
      this.drawPolygon();
    }

    this.polygon.push(line);
    console.log(this.polygon);
  }

  connectLines() {
    if (this.polygon.length === 0) {
      return;
    }
    const firstLine = this.polygon[0];
    this.polygon.push(firstLine);
    this.polygonList.push(this.polygon);
    this.polygon = [];
    this.drawPolygon();
  }

  drawPolygon() {
    console.log("draw polygon called");
    if (!this.ctx) {
      console.log("not context from draw polygon");

      return;
    }
    console.log(this.polygon);

    this.ctx.beginPath();
    this.polygonList.forEach((polygon) => {
      polygon.forEach((line, i: number) => {
        console.log(i);

        if (i !== 0) {
          this.ctx!.lineTo(line.x, line.y);
          this.ctx!.stroke(); // draw stroke line
        }
        this.ctx!.moveTo(line.x, line.y);
        // this.ctx!.closePath(); // go back to point
      });
    });
    // this.polygon.forEach((line, i: number) => {
    //   console.log(i);

    //   if (i !== 0) {
    //     this.ctx!.lineTo(line.x, line.y);
    //     this.ctx!.stroke(); // draw stroke line
    //   }
    //   this.ctx!.moveTo(line.x, line.y);
    //   // this.ctx!.closePath(); // go back to point
    // });
    // this.ctx.moveTo(20, 40); // point 1
    // this.ctx.lineTo(70, 150); // point 2
    // this.ctx.lineTo(110, 80); // point 3
    // this.ctx.lineTo(180, 170); // point 4
    // this.ctx.lineTo(150, 70); // point 5
    // this.ctx.closePath(); // go back to point 1
    // this.ctx.stroke(); // draw stroke line
  }
}
