import PersianVerbExplorer from "./components/conjugator";
import { promises as fs } from 'fs';

interface ConjugatedVerbs {
  positive: string[];
  negative?: string[];
}

interface Conjugation {
tense: string;
conjugatedVerbs: ConjugatedVerbs[];
// Add other properties as needed
}

interface Verb {
writtenEnglish: string;
writtenPersian: string;
spokenEnglish?: string;
spokenPersian?: string;
meaning: string;
isBasic: boolean;
conjugations: {
  spokenEnglish: Conjugation[];
  writtenEnglish: Conjugation[];
  spokenPersian: Conjugation[];
  writtenPersian: Conjugation[];
};
}


interface PersianVerbExplorerProps {
  verbs: Verb[];
}

export default async function Home() {
  const file = await fs.readFile(process.cwd() + '/src/app/data/basic_verbs_parsed.json', 'utf8');
  const verbs = JSON.parse(file) as Verb[];
  // const verbsArray = verbs[0]
  console.log("herE", verbs)

  // console.log(verbs)

  return (
    <div>
      <PersianVerbExplorer verbs={verbs as Verb[]} />
    </div>
  );
}
