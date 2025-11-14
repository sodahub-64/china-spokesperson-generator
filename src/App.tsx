import { useState, useRef, useEffect } from "react";
import "./App.css";


const DEFAULT_TEXT = `“日本が台湾海峡情勢に
武力介入すれば
中国は必ず
[正面から痛撃を加える]”`;

const today = new Date();
const DEFAULT_SIGNATURE = `中国外交部報道官  ${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

export default function App() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [signature, setSignature] = useState(DEFAULT_SIGNATURE);
  const [fontSize, setFontSize] = useState(80);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);




  useEffect(() => {
    const img = new Image();
    img.src = "./background.png";
    img.onload = () => setBgImage(img);
  }, []);




  const drawCanvas = () => {
    if (!canvasRef.current || !bgImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = bgImage.width;
    const H = bgImage.height;

    canvas.width = W;
    canvas.height = H;


    ctx.drawImage(bgImage, 0, 0, W, H);


    const lines = parseTextWithHighlight(text);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = `${fontSize}px "Noto Serif JP"`;

    const lineHeight = fontSize * 1.3;


    lines.forEach((parts, i) => {
      const y = H * 0.38 + i * lineHeight;


      let lineWidth = 0;
      parts.forEach(p => {
        lineWidth += ctx.measureText(p.text).width;
      });


      let x = (W - lineWidth) / 2;


      parts.forEach(p => {
        ctx.fillStyle = p.highlight ? "rgb(250,180,52)" : "white";
        ctx.fillText(p.text, x, y);
        x += ctx.measureText(p.text).width;
      });
    });


    ctx.font = `32px "Noto Serif JP"`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(signature, W / 2, H - 60);


    ctx.font = `20px "Noto Serif JP"`;
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("#中国外交部報道官メーカー", W - 140, H - 15);
  };

  useEffect(() => {
    drawCanvas();
  }, [text, signature, fontSize, bgImage]);


  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "MFAC-maker.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="page-center">
      <div className="container">
        <h1 className="title">中国外交部報道官メーカー</h1>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="textarea"
        />

        <div style={{ width: "400px" }}>
          <label>Font Size: {fontSize}px</label>
          <input
            type="range"
            min={20}
            max={300}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <input
          type="text"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          style={{
            width: "400px",
            padding: "8px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            textAlign: "center",
            fontFamily: "Noto Serif JP",
          }}
        />

        <button style={{ border: "1px solid #ccc" }} onClick={downloadImage}>ダウンロード</button>


        <canvas
          ref={canvasRef}
          style={{
            width: "500px",
            borderRadius: "6px",
            background: "#000",
          }}
        />
      </div>
    </div>
  );
}




function parseTextWithHighlight(text: string) {
  return text.split("\n").map((line) => {
    const result: { text: string; highlight: boolean }[] = [];

    line.split(/(\[.*?\])/g).forEach((part) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        result.push({
          text: part.slice(1, -1),
          highlight: true,
        });
      } else {
        result.push({
          text: part,
          highlight: false,
        });
      }
    });

    return result;
  });
}
