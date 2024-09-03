import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAlignLeft,
  faAlignRight,
  faAlignCenter,
} from "@fortawesome/free-solid-svg-icons";
import Draggable from "react-draggable";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

interface TextBox {
  text: string;
  top: number;
  left: number;
  width: number;
  height: number;
  isEditing: boolean;
}

function Home() {
  const [texts, setTexts] = useState<TextBox[]>([]);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number>(0);
  const [isResizing, setIsResizing] = useState(false);
  const videoRef = useRef(null);

  const addTextBox = () => {
    setTexts([
      ...texts,
      {
        text: "Your Text Here",
        top: 0,
        left: 50,
        width: 100,
        height: 50,
        isEditing: false,
      },
    ]);
  };

  const handleTextChange = <K extends keyof TextBox>(
    index: number,
    property: K,
    value: TextBox[K]
  ) => {
    const updatedTexts = [...texts];
    updatedTexts[index][property] = value;
    setTexts(updatedTexts);
  };

  const deleteTextBox = (index: number) => {
    setTexts(texts.filter((_, i) => i !== index));
  };

  const toggleEditMode = (index: number) => {
    const updatedTexts = [...texts];
    updatedTexts[index].isEditing = !updatedTexts[index].isEditing;
    setTexts(updatedTexts);
  };

  const handleBlur = (index: number) => {
    const updatedTexts = [...texts];
    updatedTexts[index].isEditing = false;
    setTexts(updatedTexts);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragStop = (index: number, e: any, data: any) => {
    if (!isResizing) {
      setTexts((prevTexts) => {
        const updatedTexts = [...prevTexts];
        updatedTexts[index].top = data.y;
        updatedTexts[index].left = data.x;
        return updatedTexts;
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleResize = (index: number, e: any, { size }: any) => {
    setTexts((prevTexts) => {
      const updatedTexts = [...prevTexts];
      updatedTexts[index].width = size.width;
      updatedTexts[index].height = size.height;
      return updatedTexts;
    });
  };

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
  };

  return (
    <div className="flex justify-between px-4 py-20">
      <div className="mx-auto w-2/3 relative">
        <ReactPlayer
          ref={videoRef}
          url="/mountains.mp4"
          controls
          width="100%"
          height="100%"
        />
        {texts.map((text, index) => (
          <Draggable
            key={index}
            position={{ x: text.left, y: text.top }}
            onStop={(e, data) => handleDragStop(index, e, data)}
            disabled={isResizing}
          >
            <Resizable
              width={text.width}
              height={text.height}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onResize={(e: any, data: any) => handleResize(index, e, data)}
              minConstraints={[60, 20]}
              onResizeStart={handleResizeStart}
              onResizeStop={handleResizeStop}
            >
              <div
                style={{
                  position: "absolute",
                  border: selectedTextIndex === index ? "2px solid blue" : "",
                  cursor: isResizing ? "default" : "move",
                  top: `${text.top}`,
                  left: `${text.left}`,
                  padding: "5px",
                  backgroundColor:
                    selectedTextIndex === index
                      ? "rgba(255, 255, 255, 0.3)"
                      : "",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: `${text.width}px`,
                  height: `${text.height}px`,
                }}
                onClick={() => setSelectedTextIndex(index)}
                onDoubleClick={() => toggleEditMode(index)}
              >
                {text.isEditing ? (
                  <Input
                    value={text.text}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      border: "none",
                      width: "100%",
                      height: "100%",
                      textAlign: "center",
                    }}
                    onChange={(e) =>
                      handleTextChange(index, "text", e.target.value)
                    }
                    onBlur={() => handleBlur(index)}
                    autoFocus
                  />
                ) : (
                  <div
                    style={{ cursor: "text", width: "100%", height: "100%" }}
                    onClick={() => toggleEditMode(index)}
                  >
                    {text.text}
                  </div>
                )}
                {selectedTextIndex === index && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "-10px",
                      cursor: "pointer",
                    }}
                    onClick={() => deleteTextBox(index)}
                  >
                    ❌
                  </div>
                )}
              </div>
            </Resizable>
          </Draggable>
        ))}
      </div>
      <aside className="basis-3/12 bg-white rounded-lg text-center py-6 px-8">
        <Button onClick={addTextBox}>Add Text</Button>
        <hr className="mt-4 bg-slate-400 h-[2px]" />

        <div className="py-4 px-3">
          <div className="mt-2">
            <h4 className="text-left mb-2 font-bold">Position</h4>
            <div className="flex justify-between">
              <div className="flex items-center justify-start">
                <label className="font-semibold">X</label>
                <Input
                  type="number"
                  className="w-2/5 ml-4 bg-gray-200"
                  value={texts[selectedTextIndex]?.top}
                  onChange={(e) =>
                    handleTextChange(
                      selectedTextIndex,
                      "top",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-end">
                <label className="font-semibold">Y</label>
                <Input
                  type="number"
                  className="w-2/5 ml-4 bg-gray-200"
                  value={texts[selectedTextIndex]?.left}
                  onChange={(e) =>
                    handleTextChange(
                      selectedTextIndex,
                      "left",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <div className="flex  items-center">
                <label>W</label>
                <Input
                  className="w-16 bg-gray-200 ml-3"
                  type="number"
                  value={texts[selectedTextIndex]?.width}
                  onChange={(e) =>
                    handleTextChange(
                      selectedTextIndex,
                      "width",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
              <div className="flex  items-center">
                <label>H</label>
                <Input
                  className="w-16 ml-3 bg-gray-200"
                  type="number"
                  value={texts[selectedTextIndex]?.height}
                  onChange={(e) =>
                    handleTextChange(
                      selectedTextIndex,
                      "height",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
            </div>
            <hr className="mt-4 bg-slate-400 h-[2px]" />
            <div className="">
              <h4 className="text-left my-4 font-bold">Text</h4>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Font Family" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Poppins</SelectItem>
                  <SelectItem value="dark">Open Sans</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-between my-4">
                <Select>
                  <SelectTrigger className="w-3/5">
                    <SelectValue placeholder="Font Weight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Regular</SelectItem>
                    <SelectItem value="dark">Medium</SelectItem>
                    <SelectItem value="system">Semibold</SelectItem>
                    <SelectItem value="dark">Bold</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-1/4">
                    <SelectValue placeholder="16" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16px">16</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="28">28</SelectItem>
                    <SelectItem value="32">32</SelectItem>
                    <SelectItem value="36">36</SelectItem>
                    <SelectItem value="40">40</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                    <SelectItem value="56">56</SelectItem>
                    <SelectItem value="64">64</SelectItem>
                    <SelectItem value="72">72</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between">
                <ToggleGroup type="single" className="bg-gray-200 rounded-lg">
                  <ToggleGroupItem value="a" className="font-bold">
                    <FontAwesomeIcon icon={faAlignLeft} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="b">
                    <FontAwesomeIcon icon={faAlignCenter} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="c">
                    <FontAwesomeIcon icon={faAlignRight} />
                  </ToggleGroupItem>
                </ToggleGroup>
                <ToggleGroup type="single" className="bg-gray-200 rounded-lg">
                  <ToggleGroupItem value="a" className="font-bold text-xl">
                    B
                  </ToggleGroupItem>
                  <ToggleGroupItem value="b" className="italic">
                    I
                  </ToggleGroupItem>
                  <ToggleGroupItem value="c" className="underline">
                    U
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <h4 className="text-left my-4 font-bold">Fill</h4>
              <div className="flex items-center">
                <div className="">
                  <Input
                    type="color"
                    value=""
                    //   onChange={(e) => handleColorChange(e.target.value)}
                    className=""
                  />
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="#FF0000">Red</SelectItem>
                    <SelectItem value="#00FF00">Green</SelectItem>
                    <SelectItem value="#0000FF">Blue</SelectItem>
                    <SelectItem value="#FFFF00">Yellow</SelectItem>
                    <SelectItem value="#FF00FF">Magenta</SelectItem>
                    <SelectItem value="#00FFFF">Cyan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <h4 className="text-left my-4 font-bold">Stroke</h4>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Home;
