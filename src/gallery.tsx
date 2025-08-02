import { Action, ActionPanel, Detail, List, Color, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import { showFailureToast } from "@raycast/utils";

type ListData = {
  filename: string;
  title: string;
  author: string;
  description: string;
  isNew: boolean;
  tags: string[];
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
        if (!res.ok) throw new Error("Network response was not ok :( maybe check wifi?");
        return res.json() as Promise<ListData[]>;
      })
      .then((data) => {
        setGallery(data);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    showFailureToast(error, { title: "Oh uh! Something went wrong!" });
    return <Detail markdown={`THE ERROR: ${error}`} />;
  }

  if (gallery.length === 0) {
    return <Detail markdown="## Loading gallery... If this is stuck try to go back and try again." />;
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
                value: truncate((item.isNew ? "New game! " : "") + item.description, 80),
                color: item.isNew ? Color.Yellow : undefined,
              },
            },
          ]}
          keywords={[item.filename, item.author, item.title, ...item.tags]}
          actions={
            <ActionPanel title={"Open " + item.title}>
              <Action.OpenInBrowser url={`https://sprig.hackclub.com/gallery/play/${item.filename}`} title="Play in Browser"/>
              <Action.CopyToClipboard content={`https://sprig.hackclub.com/gallery/play/${item.filename}`} title="Copy the URL" shortcut={{modifiers: ["cmd"], key: "c"}}/>
              <Action.OpenInBrowser url={`https://sprig.hackclub.com/~/new-game?remix=${item.filename}`} title="Remix the Game." shortcut={{modifiers: ["cmd"], key: "r"}} icon={{ source: Icon.Repeat }}/>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
