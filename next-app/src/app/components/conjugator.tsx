'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Toggle } from "@/components/ui/toggle"
import { ConjugationsBox } from './TenseConjugationBox'
import { ConjugationTenses, Verb } from '../interfaces/VerbInterfaces'


// Add this helper function at the top of the file, outside of the component
const normalizeText = (text: string): string => {
  // return text
  return text.toLowerCase().replace(/ā/g, 'a');
};


interface PersianVerbExplorerProps {
  verbs: Verb[];
}

const PersianVerbExplorer: React.FC<PersianVerbExplorerProps> = ({ verbs }) => {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedVerb, setSelectedVerb] = useState<Verb | null>(null)
  const [isFarsi, setIsFarsi] = useState(false)

  // Add a new state to manage the debounced input
  const [debouncedInput, setDebouncedInput] = useState(input);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 1000); // 300ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [input]);

  useEffect(() => {
    if (debouncedInput.length > 0) {
      const normalizedInput = normalizeText(debouncedInput);
      const filtered = verbs.filter((verb: Verb) => {
        if (isFarsi) {
          // When isFarsi is true, search in the transliterated Farsi fields
          // First check the main verb forms
          if (normalizeText(verb.writtenEnglish).includes(normalizedInput) || 
              (verb.spokenEnglish && normalizeText(verb.spokenEnglish).includes(normalizedInput))) {
            return true;
          }
          
          // Then check all conjugation forms
          if (verb.conjugations && verb.conjugations.spokenEnglish) {
            // Search through all tenses
            for (const tense in verb.conjugations.spokenEnglish) {
              if (tense.includes('Progressive')) {
                continue;
              }

              const tenseData = verb.conjugations.spokenEnglish[tense as keyof ConjugationTenses];
              
              // Search through positive forms
              if (tenseData.positive && tenseData.positive.some(form => 
                  normalizeText(form).includes(normalizedInput))) {
                return true;
              }
              
              // Search through negative forms
              if (tenseData.negative && tenseData.negative.some(form => 
                  normalizeText(form).includes(normalizedInput))) {
                return true;
              }
            }
          }
          return false;
        } else {
          // When isFarsi is false, search in the meaning field (English definition)
          return normalizeText(verb.meaning).includes(normalizedInput);
        }
      });
      
      setSuggestions(filtered.map((verb: Verb) => {
        if (isFarsi) {
          return `${verb.writtenEnglish}`;
        } else {
          return `${verb.meaning} |&nbsp<strong>${verb.writtenEnglish}</strong>`;
        }
      }));
    } else {
      setSuggestions([]);
    }
  }, [debouncedInput, isFarsi, verbs]);

  const handleSelectVerb = (suggestion: string) => {
    const selectedVerbData = verbs.find((v: Verb) => {
      if (isFarsi) {
        return v.writtenEnglish === suggestion;
      } else {
        // Extract the meaning part from the suggestion
        const meaningPart = suggestion.split(' |')[0];
        return v.meaning === meaningPart;
      }
    });
    setSelectedVerb(selectedVerbData || null);
    // setInput(suggestion)
    // setSuggestions([])
  };

  return (
    <div className="container mx-auto p-4 text-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Persian Verb Explorer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              type="text"
              placeholder={isFarsi ? "یک فعل تایپ کنید..." : "Type a verb..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow"
            />
            <Toggle
              pressed={isFarsi}
              onPressedChange={(pressed) => {
                console.log('pressed', pressed)
                setIsFarsi(pressed)
                setInput('')
                setSuggestions([])
              }}
              aria-label="Toggle language"
            >
              {isFarsi ? 'FA' : 'EN'}
            </Toggle>
          </div>


          {(
            <ScrollArea className="h-32 rounded-md border p-2 mb-4">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleSelectVerb(suggestion)}
                  dangerouslySetInnerHTML={{ __html: suggestion }}>
                  {/* {suggestion} */}
                </Button>
              ))}
            </ScrollArea>
          )}



          {selectedVerb && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{selectedVerb?.writtenEnglish}</span>
                  <span className="text-right">{selectedVerb?.writtenPersian}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isFarsi ? (
                    <>
                      {selectedVerb.spokenEnglish && (
                        <div>
                          <h3 className="font-semibold">Spoken Form:</h3>
                          <p>{selectedVerb.spokenEnglish}</p>
                        </div> 
                      )}
                      {selectedVerb.writtenEnglish && (
                        <div>
                          <h3 className="font-semibold">Written Form:</h3>
                          <p>{selectedVerb.writtenEnglish}</p>
                        </div>
                      )}
                       <div>
                      <h3 className="font-semibold">Meaning:</h3>
                      <p dangerouslySetInnerHTML={{ __html: selectedVerb.meaning }}></p>
                    </div>
                    </>
                  ) : (
                    <div>
                      <h3 className="font-semibold">Meaning:</h3>
                      <p dangerouslySetInnerHTML={{ __html: selectedVerb.meaning }}></p>
                    </div>
                  )}
                  <div>
                    <Badge variant={selectedVerb.isBasic ? "default" : "secondary"}>
                      {selectedVerb.isBasic ? "Basic Verb" : "Advanced Verb"}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold">Conjugations:</h3>


                    <div className="space-y-2">
                        <ConjugationsBox conjugations={selectedVerb.conjugations} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PersianVerbExplorer
