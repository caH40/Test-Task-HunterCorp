/**
 * Класс, представляющий круг на холсте Canvas.
 */
export class Circle {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  isMouseover: boolean;
  mousedownX: number;
  mousedownY: number;
  mouseupX: number;
  mouseupY: number;
  /**
   * Создает новый экземпляр класса Circle.
   * @param canvas Элемент холста HTMLCanvasElement.
   * @param ctx Контекст рисования на холсте CanvasRenderingContext2D.
   * @param x Координата x центра круга.
   * @param y Координата y центра круга.
   * @param radius Радиус круга.
   */
  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = 0;
    this.dy = 0;
    this.isMouseover = false;
    this.mousedownX = 0;
    this.mousedownY = 0;
    this.mouseupX = 0;
    this.mouseupY = 0;
  }

  /**
   * Обработчик события mousedown.
   * @param mouseX Координата x курсора мыши.
   * @param mouseY Координата y курсора мыши.
   */
  mousedown(mouseX: number, mouseY: number) {
    this.mousedownX = mouseX;
    this.mousedownY = mouseY;

    const dx = mouseX - this.x;
    const dy = mouseY - this.y;

    const dis = Math.sqrt(dx * dx + dy * dy);
    this.isMouseover = dis <= this.radius;
  }

  /**
   * Обработчик события mouseup.
   * @param mouseX Координата x курсора мыши.
   * @param mouseY Координата y курсора мыши.
   */
  mouseup(mouseX: number, mouseY: number) {
    this.mouseupX = mouseX;
    this.mouseupY = mouseY;
    if (this.isMouseover) {
      this.push();
    }
  }

  /**
   * Применяет силу круга после нажатия мышью.
   */
  push() {
    const slow = 100;
    this.dx = (this.mouseupX - this.mousedownX) / slow;
    this.dy = (this.mouseupY - this.mousedownY) / slow;
  }

  /**
   * Обновляет положение круга.
   */
  update() {
    this.x += this.dx;
    this.y += this.dy;

    // При выходе за границу холста.
    if (this.y + this.radius > this.canvas.height) {
      this.y = this.canvas.height - this.radius;
    }
    if (this.y < this.radius) {
      this.y = this.radius;
    }

    if (this.x + this.radius > this.canvas.width) {
      this.x = this.canvas.width - this.radius;
    }
    if (this.x < this.radius) {
      this.x = this.radius;
    }

    this.bounceWall();
  }

  /**
   * Устанавливает скорость движения круга.
   * @param dx Компонента скорости по оси x.
   * @param dy Компонента скорости по оси y.
   */
  setSpeed(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }

  /**
   * Отражает круг от стенок холста.
   */
  bounceWall() {
    if (this.x + this.radius >= this.canvas.width || this.x - this.radius <= 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius >= this.canvas.height || this.y - this.radius <= 0) {
      this.dy = -this.dy;
    }
  }

  /**
   * Рисует круг на холсте.
   */
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.closePath();
  }
}
