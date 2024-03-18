import { useEffect } from 'react';
import { Circle } from './shapes/circle';

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
};

/**
 * Функция для работы с холстом и создания анимации на основе переданного холста.
 */
export default function useCanvas({ canvasRef }: Props) {
  useEffect(() => {
    // Получаем ссылку на элемент холста.
    const canvas = canvasRef?.current;
    if (!canvas) {
      return;
    }
    // Получаем контекст рисования на холсте.
    const ctx = canvas?.getContext('2d');
    if (!ctx) {
      return;
    }

    // Устанавливаем размеры холста.
    canvas.width = 1200;
    canvas.height = 600;

    // Устанавливаем радиус кругов.
    const radius = 50;

    /**
     * Функция для генерации массива объектов Circle для представления кругов на холсте.
     */
    function createCircles(quantity: number) {
      if (!canvas || !ctx) {
        return [];
      }
      // Первоначальное расстояние между шарами и боковыми станками холста.
      const gap = 10;

      // Сколько шаров поместится на холсте.
      const quantityX = Math.trunc(canvas.width / (2 * radius + gap));
      const quantityY = Math.trunc(canvas.height / (2 * radius + gap));

      if (quantity > quantityX * quantityY) {
        console.log('Превышено количество возможных шаров'); // eslint-disable-line
        return [];
      }

      // Номер строки и столбца на которой располагаются круги.
      let row = 1;
      let column = 1;

      // Генерирование начального появления кругов (координат центра).
      const coordinates = Array(quantity)
        .fill(1)
        .map((_, index) => {
          row = Math.ceil((index + 1) / quantityX);
          column = index + 1 - quantityX * (row - 1);

          return {
            x: (column - 1) * (gap + 2 * radius) + gap + radius,
            y: (row - 1) * (gap + 2 * radius) + gap + radius,
          };
        });

      return coordinates.map((elm) => new Circle(canvas, ctx, elm.x, elm.y, radius));
    }

    // Создание кругов
    const n = 15;
    const circles = createCircles(n);

    // Обработчик события нажатия кнопки мыши.
    canvas.addEventListener('mousedown', (e) => {
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;
      circles.forEach((circle) => circle.mousedown(mouseX, mouseY));
    });

    // Обработчик события отпускания кнопки мыши.
    canvas.addEventListener('mouseup', (e) => {
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;
      circles.forEach((circle) => circle.mouseup(mouseX, mouseY));
    });

    /**
     * Функция для обновления положения кругов и обработки столкновений.
     * @param {Circle[]} circles - Массив кругов.
     */
    function bounceCircle(circles: Circle[]) {
      for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
          bounce2Circle(circles[i], circles[j]);
        }
      }
    }

    /**
     * Обработка столкновения двух кругов.
     * @param {Circle} circle1 - Первый круг.
     * @param {Circle} circle2 - Второй круг.
     */
    function bounce2Circle(circle1: Circle, circle2: Circle) {
      const dxCircles = circle1.x - circle2.x;
      const dyCircles = circle1.y - circle2.y;

      // Расстояние между центрами кругов
      const distanceCenters = Math.sqrt(dxCircles * dxCircles + dyCircles * dyCircles);

      const sinA = dxCircles / distanceCenters;
      const cosA = dyCircles / distanceCenters;

      // глубина наложения друг на друга окружностей
      const deep = distanceCenters - (circle1.radius + circle2.radius);
      if (deep <= 0) {
        let vn1 = circle2.dx * sinA + circle2.dy * cosA;
        let vn2 = circle1.dx * sinA + circle1.dy * cosA;

        vn1 = circle2.dx * sinA + circle2.dy * cosA;
        vn2 = circle1.dx * sinA + circle1.dy * cosA;

        const vt1 = -circle2.dx * cosA + circle2.dy * sinA;
        const vt2 = -circle1.dx * cosA + circle1.dy * sinA;

        const temp = vn2;
        vn2 = vn1;
        vn1 = temp;

        const dx1 = vn2 * sinA - vt2 * cosA;
        const dy1 = vn2 * cosA + vt2 * sinA;
        const dx2 = vn1 * sinA - vt1 * cosA;
        const dy2 = vn1 * cosA + vt1 * sinA;
        circle1.setSpeed(dx1, dy1);
        circle2.setSpeed(dx2, dy2);
      }
    }

    /**
     * Функция анимации движения кругов.
     */
    function animation(): void {
      if (!canvas || !ctx) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bounceCircle(circles);

      circles.forEach((circle) => {
        circle.draw();
        circle.update();
      });
      requestAnimationFrame(animation);
    }

    animation();
  }, [canvasRef]);
}
