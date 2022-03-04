import { useEffect, useState } from "react";

export const useFormatHash = (name: string, trim: number = 3) => {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    if (name.includes("[")) {
      const hashLength = 64 - trim * 2;
      const regexReplacement = new RegExp(
        `(?<=\\[.{${trim}}).{${hashLength}}(?=.{${trim}}\\])`,
        "g"
      );
      const withFormat = name
        .replaceAll("0x", "")
        .replaceAll(regexReplacement, "...");
      setFormatted(withFormat);
    } else {
      setFormatted(name);
    }
  }, [name, trim]);

  return formatted;
};
