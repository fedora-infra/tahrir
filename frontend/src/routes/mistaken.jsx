import { Alert } from "react-bootstrap";

export default function Mistaken() {
  const list = [
    "Flat tyre - You should be walking",
    "How about we explore the area ahead of us later?",
    "This is surely not what you were looking for",
    "I swear it was supposed to be here",
    "Segmentation fault - Core dumped",
    "Redirecting to SourceForge - Just kidding",
    "It is okay to get lost every now and then",
    "Even the things we love break sometimes",
    "Try refreshing and see if you find it?",
    "We looked everywhere - Even under the couch",
  ];
  const time = Math.floor(Date.now() / 1000);
  const text = list[time % list.length];

  return (
    <Alert variant="warning">
      <Alert.Heading className="dataelem">Resource unavailable</Alert.Heading>
      <span className="small">{text}</span>
    </Alert>
  );
}
