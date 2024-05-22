"use client";
import Appbar from "./component/Appbar";
import CreateTask from "./component/CreateTask";

export default function Home() {
  return (
    <div>
      <Appbar />
      <CreateTask />
    </div>
  );
}
