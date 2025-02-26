export interface Verb {
    spokenEnglish: string;
    writtenEnglish: string;
    meaning: string;
    writtenPersian: string;
    spokenPersian: string;
    isBasic: boolean;
    conjugations: VerbConjugations;
  }
  
  export interface VerbConjugations {
    spokenEnglish?: ConjugationTenses;
    writtenEnglish?: ConjugationTenses;
    writtenPersian?: ConjugationTenses;
    spokenPersian?: ConjugationTenses;
  }
  
  export interface ConjugationTenses {
    "Simple Past"?: ConjugationForms;
    "Imperfect"?: ConjugationForms;
    "Perfect Subjunctive"?: ConjugationForms;
    "Past Progressive"?: ConjugationForms;
    "Present Perfect"?: ConjugationForms;
    "Past Perfect"?: ConjugationForms;
    "Present Indicative"?: ConjugationForms;
    "Present Progressive"?: ConjugationForms;
    "Present Subjunctive"?: ConjugationForms;
    "Future"?: ConjugationForms;
    "Imperative"?: ConjugationForms;
  }
  
  export interface ConjugationForms {
    positive: string[];
    negative?: string[];
  }
  

  type VerbsList = Verb[];