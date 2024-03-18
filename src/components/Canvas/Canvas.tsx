import { useRef } from 'react';
import useCanvas from '../../hooks/useCanvas';

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useCanvas({ canvasRef });

  return (
    <>
      <canvas className="canvas" ref={canvasRef}></canvas>
    </>
  );
}

export default Canvas;
