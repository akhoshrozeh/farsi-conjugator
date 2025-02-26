import PersianVerbExplorer from "./components/conjugator";
import { promises as fs } from 'fs';
import { Verb } from "./interfaces/VerbInterfaces";

interface PersianVerbExplorerProps {
  verbs: Verb[];
}

export default async function Home() {
  const file = await fs.readFile(process.cwd() + '/src/app/data/all_verbs_parsed.json', 'utf8');
  const verbs = JSON.parse(file) as Verb[];

  return (
    <div>
      <PersianVerbExplorer verbs={verbs as Verb[]} />
    </div>
  );
}
