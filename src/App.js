import { useState, useRef } from "react";
import "./styles.css";

export default function App() {
  const [memos, setMemos] = useState([
    { id: 1, text: "📝 メモ1", x: 100, y: 100, z: 1 },
    { id: 2, text: "💡 メモ2", x: 250, y: 150, z: 2 },
  ]);
  const zCounter = useRef(3);
  const idCounter = useRef(3);

  const handleDrag = (id, dx, dy) => {
    setMemos((prev) =>
      prev.map((memo) =>
        memo.id === id ? { ...memo, x: memo.x + dx, y: memo.y + dy } : memo
      )
    );
  };

  const bringToFront = (id) => {
    setMemos((prev) =>
      prev.map((memo) =>
        memo.id === id ? { ...memo, z: zCounter.current++ } : memo
      )
    );
  };

  const addMemo = () => {
    const newMemo = {
      id: idCounter.current++,
      text: "🆕 新しいメモ",
      x: Math.random() * 300 + 50,
      y: Math.random() * 300 + 50,
      z: zCounter.current++,
    };
    setMemos((prev) => [...prev, newMemo]);

    // 👇 FastAPIにPOSTリクエスト
    try {
      await fetch("http://localhost:8000/memos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMemo),
      });
    } catch (error) {
      console.error("メモの送信に失敗しました", error);
    }
  };

  const updateMemoText = (id, newText) => {
    setMemos((prev) =>
      prev.map((memo) => (memo.id === id ? { ...memo, text: newText } : memo))
    );
  };

  const deleteMemo = (id) => {
    setMemos((prev) => prev.filter((memo) => memo.id !== id));
  };

  return (
    <div className="board">
      <button className="add-button" onClick={addMemo}>
        ＋メモ追加
      </button>
      {memos.map((memo) => (
        <MemoItem
          key={memo.id}
          {...memo}
          onDrag={handleDrag}
          onFocus={bringToFront}
          onChangeText={updateMemoText}
          onDelete={deleteMemo}
        />
      ))}
    </div>
  );
}

function MemoItem({
  id,
  text,
  x,
  y,
  z,
  onDrag,
  onFocus,
  onChangeText,
  onDelete,
}) {
  const itemRef = useRef(null);
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  const handleDown = (e) => {
    dragging.current = true;
    onFocus(id);
    const clientX = e.clientX ?? e.touches[0].clientX;
    const clientY = e.clientY ?? e.touches[0].clientY;
    start.current = { x: clientX, y: clientY };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("touchmove", handleMove);
    document.addEventListener("touchend", handleUp);
  };

  const handleMove = (e) => {
    if (!dragging.current) return;
    const clientX = e.clientX ?? e.touches[0].clientX;
    const clientY = e.clientY ?? e.touches[0].clientY;
    const dx = clientX - start.current.x;
    const dy = clientY - start.current.y;
    onDrag(id, dx, dy);
    start.current = { x: clientX, y: clientY };
  };

  const handleUp = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", handleMove);
    document.removeEventListener("mouseup", handleUp);
    document.removeEventListener("touchmove", handleMove);
    document.removeEventListener("touchend", handleUp);
  };

  const handleChange = (e) => {
    onChangeText(id, e.target.value);
  };

  return (
    <div
      ref={itemRef}
      className="memo"
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      style={{ left: x, top: y, zIndex: z }}
    >
      <button className="delete-button" onClick={() => onDelete(id)}>
        ×
      </button>
      <textarea
        className="memo-text"
        value={text}
        onChange={handleChange}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      />
    </div>
  );
}

import { useEffect } from "react";

// ...Appコンポーネントの中
useEffect(() => {
  const fetchMemos = async () => {
    try {
      const res = await fetch("http://localhost:8000/memos");
      const data = await res.json();
      setMemos(data);
      // IDとZのカウンターも更新しておこう
      idCounter.current = Math.max(...data.map((m) => m.id), 0) + 1;
      zCounter.current = Math.max(...data.map((m) => m.z), 0) + 1;
    } catch (error) {
      console.error("メモの取得に失敗しました", error);
    }
  };

  fetchMemos();
}, []);
