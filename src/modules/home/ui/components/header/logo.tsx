import Link from "next/link";
import WordRotate from "../word-rotate";
import { RiCameraLensFill } from "react-icons/ri";

const Logo = () => {
  return (
    <Link href="/" className="flex gap-2 items-center">
      <RiCameraLensFill size={18} />
      <WordRotate label="I'm Abdul Khader" label2="Developer" style="font-medium uppercase" />
    </Link>
  );
};

export default Logo;
