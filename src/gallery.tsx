import { Action, ActionPanel, Detail, List, Color } from "@raycast/api";
import { useEffect, useState } from "react";
import { showFailureToast } from "@raycast/utils";

type ListData = {
  filename: string;
  title: string;
  author: string;
  description: string;
  isNew: boolean;
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
    showFailureToast(error, { title: "Oh uh! Something went wrong!" });
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
          accessories={[
            {
              text: {
                value: truncate((item.isNew ? "New! " : "") + item.description, 80),
                color: item.isNew ? Color.Yellow : undefined,
              },
            },
          ]}
          keywords={[item.filename, item.author]}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={`https://sprig.hackclub.com/gallery/play/${item.filename}`} title="Play in browser"/>
              <Action.OpenInBrowser url={`https://sprig.hackclub.com/~/new-game?remix=${item.filename}`} title="Remix the game."/>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
