"use client"; 
import { Stage, Layer, Line, Rect, Circle, Ellipse, Text } from "react-konva";
import { useState, useRef, useEffect } from "react";

export default function DrawSpace() {
    const [isDrawing, setIsDrawing] = useState(false);
    const [lines, setLines] = useState<any[]>([]);
    const [tool, setTool] = useState("pen");
    const [rectangle, setRect] = useState<any[]>([]);
    const [circle, setCircle] = useState<any[]>([]);
    const [texts, setTexts] = useState<any[]>([]);
    const [strokeColor, setColor] = useState("white");
    const [strokeWidth, setWidth] = useState(3); 
    const [fontSize, setFontSize] = useState(20);
    const [textInput, setTextInput] = useState("");
    const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
    const stageRef = useRef(null);
    const textInputRef = useRef<HTMLInputElement>(null);
    const [currentShape, setCurrentShape] = useState<any>(null);

    const handleMouseDown = (e : any) => {
        const pos = e.target.getStage().getPointerPosition();
        if(tool === "pen" || tool === "eraser"){
            setIsDrawing(true);
            setCurrentShape({
                startX: pos.x,
                startY: pos.y,
                points: [pos.x, pos.y],
                stroke: tool === "eraser" ? "black" : strokeColor, 
                strokeWidth: strokeWidth
            });
        } else if (tool === "rect") {
            setIsDrawing(true);
            setCurrentShape({
                startX: pos.x,
                startY: pos.y,
                x: pos.x,
                y: pos.y,
                width: 0,
                height: 0,
                stroke: strokeColor,
                strokeWidth: strokeWidth
            });
        } else if (tool === "circle"){
            setIsDrawing(true);
            setCurrentShape({
                startX: pos.x,
                startY: pos.y,
                x: pos.x,
                y: pos.y,
                radiusX: 0,
                radiusY: 0,
                stroke: strokeColor,
                strokeWidth: strokeWidth
            });
        } else if (tool === "text") {
            // Position the text input at the click location
            setTextPosition({ x: pos.x, y: pos.y });
            // Focus on the input
            setTimeout(() => {
                textInputRef.current?.focus();
            }, 0);
        }
    }

    const handleTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && textInput.trim()) {
            // Add text to texts array
            setTexts([...texts, {
                x: textPosition.x,
                y: textPosition.y,
                text: textInput,
                fontSize: fontSize,
                fill: strokeColor
            }]);
            // Clear the input
            setTextInput("");
        }
    }

    const handleMouseMove = (e : any) => {
        if (!isDrawing) return; 
        const pos = e.target.getStage().getPointerPosition();

        if(tool === "pen" || tool === "eraser"){
            const updatedShape = {
                ...currentShape,
                points: [...currentShape.points, pos.x, pos.y]
            };
            setCurrentShape(updatedShape);
        } else if (tool === "rect" && currentShape) {
            const updatedShape = {
                ...currentShape,
                x: Math.min(currentShape.startX, pos.x),
                y: Math.min(currentShape.startY, pos.y),
                width: Math.abs(pos.x - currentShape.startX),
                height: Math.abs(pos.y - currentShape.startY)
            };
            setCurrentShape(updatedShape);
        } else if (tool === "circle" && currentShape) {
            const updatedShape = {
                ...currentShape,
                radiusX: Math.abs(pos.x - currentShape.startX) / 2,
                radiusY: Math.abs(pos.y - currentShape.startY) / 2,
                x: (currentShape.startX + pos.x) / 2,
                y: (currentShape.startY + pos.y) / 2
            };
            setCurrentShape(updatedShape);
        }
    }

    const handleMouseUp = () => {
        if (isDrawing) {
            if (tool === "pen" || tool === "eraser") {
                setLines([...lines, currentShape]);
            } else if (tool === "rect" && currentShape) {
                setRect([...rectangle, {
                    x: currentShape.x,
                    y: currentShape.y,
                    width: currentShape.width,
                    height: currentShape.height,
                    stroke: currentShape.stroke,
                    strokeWidth: currentShape.strokeWidth
                }]);
            } else if (tool === "circle" && currentShape) {
                setCircle([...circle, {
                    x: currentShape.x,
                    y: currentShape.y,
                    radius: Math.max(currentShape.radiusX, currentShape.radiusY),
                    stroke: currentShape.stroke,
                    strokeWidth: currentShape.strokeWidth
                }]);
            }
            setCurrentShape(null);
        }
        setIsDrawing(false);
    }

    return (
        <div className="bg-black h-screen relative">
            <div className="flex gap-2 p-2 bg-gray-800 text-white">
                <button onClick={() => setTool("pen")}>✏️ Pen</button>
                <button onClick={() => setTool("eraser")}>🧽 Eraser</button>
                <button onClick={() => setTool("rect")}>⬛ Rect</button>
                <button onClick={() => setTool("circle")}>⚫ Circle</button>
                <button onClick={() => setTool("text")}>📝 Text</button>
                <input 
                    type="color" 
                    value={strokeColor} 
                    onChange={(e) => setColor(e.target.value)} 
                    className="bg-gray-700"
                />
                <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={strokeWidth} 
                    onChange={(e) => setWidth(parseInt(e.target.value))} 
                    className="bg-gray-700"
                />
                <input 
                    type="number" 
                    min="10" 
                    max="50" 
                    value={fontSize} 
                    onChange={(e) => setFontSize(parseInt(e.target.value))} 
                    className="bg-gray-700 w-16"
                    placeholder="Font Size"
                />
            </div>

            {tool === "text" && (
                <input 
                    ref={textInputRef}
                    type="text" 
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={handleTextInputKeyDown}
                    placeholder="Type text here"
                    style={{
                        position: 'absolute', 
                        left: `${textPosition.x}px`, 
                        top: `${textPosition.y}px`, 
                        color: strokeColor,
                        backgroundColor: 'transparent',
                        border: `1px solid ${strokeColor}`,
                        fontSize: `${fontSize}px`
                    }}
                    className="outline-none"
                />
            )}

            <Stage
                ref={stageRef}
                width={window.innerWidth}
                height={window.innerHeight - 50}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="bg-black"
            >
                <Layer>
                    {lines.map((line, i) => (
                        <Line 
                            key={i} 
                            points={line.points} 
                            stroke={line.stroke} 
                            strokeWidth={line.strokeWidth} 
                            lineCap="round"
                            lineJoin="round"
                        />
                    ))}

                    {rectangle.map((rect, i) => (
                        <Rect 
                            key={i} 
                            x={rect.x} 
                            y={rect.y} 
                            width={rect.width} 
                            height={rect.height} 
                            stroke={rect.stroke}
                            strokeWidth={rect.strokeWidth}
                            fill="transparent"
                        />
                    ))}

                    {circle.map((crl, i) => (
                        <Circle 
                            key={i} 
                            x={crl.x} 
                            y={crl.y} 
                            radius={crl.radius} 
                            stroke={crl.stroke}
                            strokeWidth={crl.strokeWidth}
                            fill="transparent"
                        />
                    ))}

                    {texts.map((txt, i) => (
                        <Text
                            key={i}
                            x={txt.x}
                            y={txt.y}
                            text={txt.text}
                            fontSize={txt.fontSize}
                            fill={txt.fill}
                        />
                    ))}

                    {/* Render current shape while drawing */}
                    {currentShape && tool === "pen" && (
                        <Line 
                            points={currentShape.points} 
                            stroke={currentShape.stroke}
                            strokeWidth={currentShape.strokeWidth} 
                            lineCap="round"
                            lineJoin="round"
                        />
                    )}

                    {currentShape && tool === "rect" && (
                        <Rect 
                            x={currentShape.x} 
                            y={currentShape.y} 
                            width={currentShape.width} 
                            height={currentShape.height} 
                            stroke={currentShape.stroke}
                            strokeWidth={currentShape.strokeWidth}
                            fill="transparent"
                        />
                    )}

                    {currentShape && tool === "circle" && (
                        <Ellipse 
                            x={currentShape.x} 
                            y={currentShape.y} 
                            radiusX={currentShape.radiusX} 
                            radiusY={currentShape.radiusY}
                            stroke={currentShape.stroke}
                            strokeWidth={currentShape.strokeWidth}
                            fill="transparent"
                        />
                    )}
                </Layer>
            </Stage>
        </div>
    );
}