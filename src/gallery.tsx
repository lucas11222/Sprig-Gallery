import { Detail, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { usePromise } from "@raycast/utils";
import { setTimeout } from "node:timers/promises";

type ListData = {
  filename: string;
  title: string;
  author: string;
  description: string;
};

function truncate(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
}

export default function Command() {
  const [gallery, setGallery] = useState<ListData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://sprig.hackclub.com/api/gallery")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok :(");
        return res.json() as Promise<ListData[]>;
      })
      .then((data) => {
        setGallery(data);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return <Detail markdown={`# Oh uh! Error:\n${error}`} />;
  }

  if (gallery.length === 0) {
    return <Detail markdown="Loading gallery..." />;
  }

  return (
    <List>
      {gallery.map((item) => (
        <List.Item
          key={item.filename}
          title={item.title}
          subtitle={item.author}
          accessories={[{ text: truncate(item.description, 80) }]}
          keywords={[item.filename, item.author]}
        />
      ))}
    </List>
  );
}

