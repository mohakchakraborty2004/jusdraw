"use client"; 
import { Stage, Layer, Line, Rect, Circle } from "react-konva";
import { useState, useRef } from "react";

export default function DrawSpace() {

const [isDrawing, setIsDrawing] = useState(false);
const [lines, setLines] = useState<any[]>([]);
const [tool, setTool] = useState("pen");
const [rectangle, setRect] = useState<any[]>([]);
const [circle, setCircle ] = useState<any[]>([]);
const [strokeColor, setColor] = useState("black");
const [stokeWidth, setWidth] =  useState(3); // 1 to 10 range 
const stageRef = useRef(null);


const handleMouseDown = (e : any) => {
const pos = e.target.getStage().getPointerPosition();
if(tool === "pen" || tool === "eraser"){
    setIsDrawing(true);
    setLines([...lines, {
        points: [pos.x, pos.y],
        stroke: tool === "eraser" ? "white" : strokeColor, stokeWidth
    }])
} else if (tool === "rect") {
    setRect([...rectangle, {
        x: pos.x,
        y: pos.y,
        width: 50, 
        height: 50,
        stroke: strokeColor
    }])
} else if (tool === "circle"){
    setCircle([...circle, {
        x: pos.x,
        y: pos.y,
        radius : 25,
        stroke: strokeColor
    }])
}
}


}