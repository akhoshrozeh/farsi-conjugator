import { Verb, VerbConjugations, ConjugationTenses, ConjugationForms } from "../interfaces/VerbInterfaces";

// top level component
export const ConjugationsBox = (props: {conjugations: VerbConjugations}) => {
    
    console.log('conjugations keys:', Object.keys(props.conjugations))
    return (
        
        <div>
            {Object.entries(props.conjugations).map(([languageForm, conjugationTenses]) => (
                <div className="flex flex-col justify-center">
                    <h3 className="text-center">
                        {languageForm === 'spokenEnglish' && 'Spoken English'}
                        {languageForm === 'writtenEnglish' && 'Written English'}
                        {languageForm === 'spokenPersian' && 'Spoken Persian'}
                        {languageForm === 'writtenPersian' && 'Written Persian'}
                    </h3>
                    <LanguageFormConjugationBox conjugationTenses={conjugationTenses} languageForm={languageForm} />
                </div>
            ))}
        </div>
    ) 
}

// contains conjugations for a particular form (english written, farsi written, english spoken, farsi spoken)
export const LanguageFormConjugationBox = ( props: {conjugationTenses: ConjugationTenses, languageForm: string}) => {
    console.log(props.languageForm,'conjugationTenses:', props.conjugationTenses)
    return (
        <div className="flex flex-row flex-wrap gap-4 justify-center">
            {
                Object.entries(props.conjugationTenses).map(([tense, conjugationForms]) => (    
                    <TenseConjugationBox tense={tense} conjugatedVerbs={conjugationForms} languageForm={props.languageForm} />
                ))
            }
        </div>
    )
}


export const TenseConjugationBox = (props: {tense: string, conjugatedVerbs: ConjugationForms, languageForm: string}) => {
    const writtenPronouns = ['man', 'to', 'u', 'mā', 'shomā', 'ānhā']
    const spokenPronouns = ['man', 'to', 'un', 'mā', 'shomā', 'unā']
    return (
        <div className="border-2 border-gray-300 rounded-md p-4 min-w-64">
            <h3 className="font-bold">{props.tense}</h3>
            {props.conjugatedVerbs.positive.map((verb: string, index: number) => (
                
                <div key={index} className="flex">
                    <span className="font-bold min-w-24 md:min-w-32">
                        {props.languageForm === 'spokenPersian' || props.languageForm === 'spokenEnglish' 
                            ? spokenPronouns[index] 
                            : writtenPronouns[index]}
                    </span>
                    <span>{verb === '' ? '-' : verb}</span>
                </div>
            ))}
        </div>
    )
}   
